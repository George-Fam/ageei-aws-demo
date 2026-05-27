package org.ageei.admin_api;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.Events;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

public class GoogleCalendarService {

    private static final String APP_NAME = "AGEEI Admin API";
    private static final String SOURCE_TAG = "ageei-cms";
    private static final String TIMEZONE = "America/Montreal";

    private final Calendar calendar;
    private final String calendarId;

    /** Package-private constructor for unit tests — injects a pre-built Calendar client. */
    GoogleCalendarService(Calendar calendar, String calendarId) {
        this.calendar = calendar;
        this.calendarId = calendarId;
    }

    /** Package-private to allow test spying. */
    String getEnv(String name) {
        return System.getenv(name);
    }

    public GoogleCalendarService() throws IOException, GeneralSecurityException {
        String serviceAccountKey = getEnv("GOOGLE_SERVICE_ACCOUNT_KEY");
        String calendarId = getEnv("GOOGLE_CALENDAR_ID");

        if (serviceAccountKey == null || serviceAccountKey.isBlank()) {
            throw new IllegalStateException(
                    "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set");
        }
        if (calendarId == null || calendarId.isBlank()) {
            throw new IllegalStateException("GOOGLE_CALENDAR_ID environment variable is not set");
        }

        String impersonatedUser = getEnv("GOOGLE_IMPERSONATED_USER");
        if (impersonatedUser == null || impersonatedUser.isBlank()) {
            throw new IllegalStateException("GOOGLE_IMPERSONATED_USER environment variable is not set");
        }

        byte[] keyBytes = java.util.Base64.getDecoder().decode(serviceAccountKey.trim());
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                        new ByteArrayInputStream(keyBytes))
                .createScoped(List.of(CalendarScopes.CALENDAR))
                .createDelegated(impersonatedUser);

        this.calendar = new Calendar.Builder(GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials)).setApplicationName(APP_NAME).build();

        this.calendarId = calendarId;
    }

    public void syncFromDirectus(JsonNode directusResponse, Logger logger) throws IOException {
        JsonNode data = directusResponse.path("data");
        if (!data.isArray()) {
            logger.warning("Directus response has no 'data' array — nothing to sync");
            return;
        }
        syncEvents(data, logger);
    }

    private void syncEvents(JsonNode events, Logger logger) throws IOException {
        Map<String, String> existingEvents = getExistingAgeeiEvents();
        logger.info("Found " + existingEvents.size() +
                " existing AGEEI-managed events in Google Calendar");

        Set<String> processedIds = new HashSet<>();

        int created = 0, updated = 0, skipped = 0;
        for (JsonNode eventNode : events) {
            if (eventNode.path("isDraft").asBoolean(false)) {
                skipped++;
                continue;
            }

            String ageeiId = eventNode.path("id").asText("");
            if (ageeiId.isBlank()) {
                logger.warning("Skipping event with no 'id' field: " +
                        eventNode.path("title").asText("(no title)"));
                skipped++;
                continue;
            }

            processedIds.add(ageeiId);
            Event googleEvent = toGoogleEvent(eventNode);

            if (existingEvents.containsKey(ageeiId)) {
                calendar.events().update(calendarId, existingEvents.get(ageeiId), googleEvent)
                        .execute();
                updated++;
            } else {
                calendar.events().insert(calendarId, googleEvent).execute();
                created++;
            }
        }

        int deleted = 0;
        for (Map.Entry<String, String> entry : existingEvents.entrySet()) {
            if (!processedIds.contains(entry.getKey())) {
                calendar.events().delete(calendarId, entry.getValue()).execute();
                deleted++;
            }
        }

        logger.info(String.format(
                "Calendar sync complete: %d created, %d updated, %d deleted, %d skipped", created,
                updated, deleted, skipped));
    }

    /**
     * Fetches all Google Calendar events managed by this system
     * (identified by ageeiEventSource=ageei-cms in private extended properties).
     *
     * @return map of ageeiId, Google Calendar event ID
     */
    private Map<String, String> getExistingAgeeiEvents() throws IOException {
        Map<String, String> result = new HashMap<>();
        String pageToken = null;
        do {
            Events response = calendar.events().list(calendarId)
                    .setPrivateExtendedProperty(List.of("ageeiEventSource=" + SOURCE_TAG))
                    .setShowDeleted(false).setPageToken(pageToken).execute();

            for (Event event : response.getItems()) {
                Event.ExtendedProperties ep = event.getExtendedProperties();
                if (ep != null && ep.getPrivate() != null) {
                    String ageeiId = ep.getPrivate().get("ageeiId");
                    if (ageeiId != null && !ageeiId.isBlank()) {
                        result.put(ageeiId, event.getId());
                    }
                }
            }
            pageToken = response.getNextPageToken();
        } while (pageToken != null);

        return result;
    }

    /**
     * Converts a Directus event to Google Calendar Event.
     * If end_date is absent or null, defaults to start + 1 hour.
     */
    private Event toGoogleEvent(JsonNode node) {
        Event event = new Event();
        event.setSummary(node.path("title").asText(""));

        StringBuilder description = new StringBuilder();
        if (node.hasNonNull("description")) {
            description.append(node.get("description").asText());
        }
        if (node.hasNonNull("link_url")) {
            String label = node.hasNonNull("link_label")
                    ? node.get("link_label").asText()
                    : node.get("link_url").asText();
            if (!description.isEmpty()) description.append("\n\n");
            description.append(label).append(": ").append(node.get("link_url").asText());
        }
        if (!description.isEmpty()) {
            event.setDescription(description.toString());
        }

        ZoneId tz = ZoneId.of(TIMEZONE);
        LocalDateTime startLdt = LocalDateTime.parse(node.path("start_date").asText());

        LocalDateTime endLdt;
        String endDateStr = node.path("end_date").asText("");
        if (!endDateStr.isBlank()) {
            endLdt = LocalDateTime.parse(endDateStr);
        } else {
            endLdt = startLdt.plusHours(1);
        }

        event.setStart(new EventDateTime()
                .setDateTime(new DateTime(startLdt.atZone(tz).toInstant().toEpochMilli()))
                .setTimeZone(TIMEZONE));
        event.setEnd(new EventDateTime()
                .setDateTime(new DateTime(endLdt.atZone(tz).toInstant().toEpochMilli()))
                .setTimeZone(TIMEZONE));

        Map<String, String> privateProps = new HashMap<>();
        privateProps.put("ageeiId", node.path("id").asText());
        privateProps.put("ageeiEventSource", SOURCE_TAG);
        event.setExtendedProperties(new Event.ExtendedProperties().setPrivate(privateProps));

        return event;
    }
}
