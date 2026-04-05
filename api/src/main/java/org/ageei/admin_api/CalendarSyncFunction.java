package org.ageei.admin_api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.azure.functions.ExecutionContext;
import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;
import com.microsoft.azure.functions.HttpStatus;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import com.microsoft.azure.functions.annotation.TimerTrigger;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Optional;

public class CalendarSyncFunction {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * Called by Directus webhook when the events collection changes.
     * POST /api/sync-calendar  (with X-Webhook-Secret: <WEBHOOK_SECRET> header)
     */
    @FunctionName("syncCalendar")
    @SuppressWarnings("UnusedReturnValue") // return value consumed by Azure Functions runtime via reflection
    public HttpResponseMessage syncCalendar(@HttpTrigger(name = "req", methods = {
            HttpMethod.POST}, route = "sync-calendar", authLevel = AuthorizationLevel.ANONYMOUS)
                                            HttpRequestMessage<Optional<String>> request, ExecutionContext context) {

        context.getLogger().info("POST /api/sync-calendar");

        String expectedSecret = getEnv("WEBHOOK_SECRET");
        String providedSecret = request.getHeaders().get("x-webhook-secret");

        if (expectedSecret == null || providedSecret == null ||
                !MessageDigest.isEqual(expectedSecret.getBytes(StandardCharsets.UTF_8),
                        providedSecret.getBytes(StandardCharsets.UTF_8))) {
            return request.createResponseBuilder(HttpStatus.UNAUTHORIZED).body("Invalid or missing secret").build();
        }

        try {
            performSync(context);
            return request.createResponseBuilder(HttpStatus.OK).body("Calendar sync completed successfully").build();
        } catch (Exception e) {
            context.getLogger().severe("Sync failed: " + e.getMessage());
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Sync failed: " + e.getMessage()).build();
        }
    }

    /**
     * Nightly fallback sync at 03:00 AM Eastern (08:00 UTC) in case webhook was missed.
     */
    @FunctionName("syncCalendarScheduled")
    public void syncCalendarScheduled(@TimerTrigger(name = "timer", schedule = "0 0 8 * * *") String timerInfo,
                                      ExecutionContext context) {

        context.getLogger().info("Timer-triggered calendar sync starting. Timer info: " + timerInfo);
        try {
            performSync(context);
        } catch (Exception e) {
            context.getLogger().severe("Scheduled sync failed: " + e.getMessage());
        }
    }

    /**
     * Package-private to allow test spying.
     */
    String getEnv(String name) {
        return System.getenv(name);
    }

    /**
     * Package-private to allow test spying.
     */
    HttpClient newHttpClient() {
        return HttpClient.newHttpClient();
    }

    void performSync(ExecutionContext context) throws Exception {
        JsonNode eventsData = fetchEventsFromDirectus(context);
        GoogleCalendarService service = newGoogleCalendarService();
        service.syncFromDirectus(eventsData, context.getLogger());
    }

    /**
     * Package-private to allow test spying.
     */
    GoogleCalendarService newGoogleCalendarService() throws Exception {
        return new GoogleCalendarService();
    }

    /**
     * Fetches all events from the public Directus events collection.
     */
    JsonNode fetchEventsFromDirectus(ExecutionContext context) throws Exception {
        String directusUrl = getEnv("DIRECTUS_URL");
        if (directusUrl == null) {
            throw new IllegalStateException("DIRECTUS_URL not configured");
        }

        String url = directusUrl + "/items/events?limit=-1&sort=start_date";

        //noinspection resource — HttpClient.close() was added in Java 21; this code targets Java 17
        HttpClient client = newHttpClient();
        HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();

        HttpResponse<String> response = client.send(req, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Directus API returned " + response.statusCode());
        }

        context.getLogger().info("Fetched events from Directus");
        return MAPPER.readTree(response.body());
    }
}
