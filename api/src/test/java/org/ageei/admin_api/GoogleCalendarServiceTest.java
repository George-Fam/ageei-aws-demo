package org.ageei.admin_api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GoogleCalendarServiceTest {

    private static final String CALENDAR_ID = "test-calendar@group.calendar.google.com";
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final Logger LOGGER = Logger.getLogger("test");

    @Mock
    Calendar mockCalendar;
    @Mock
    Calendar.Events mockEvents;
    @Mock
    Calendar.Events.List mockList;
    @Mock
    Calendar.Events.Insert mockInsert;
    @Mock
    Calendar.Events.Update mockUpdate;
    @Mock
    Calendar.Events.Delete mockDelete;

    GoogleCalendarService service;

    private static GoogleCalendarService makeServiceWithEnv(String key, String calId) throws Exception {
        return makeServiceWithEnv(key, calId, "technologie@ageei.org");
    }

    private static GoogleCalendarService makeServiceWithEnv(String key, String calId, String impersonatedUser) throws Exception {
        return new GoogleCalendarService() {
            @Override
            String getEnv(String name) {
                return switch (name) {
                    case "GOOGLE_SERVICE_ACCOUNT_KEY" -> key;
                    case "GOOGLE_CALENDAR_ID" -> calId;
                    case "GOOGLE_IMPERSONATED_USER" -> impersonatedUser;
                    default -> null;
                };
            }
        };
    }

    //region Helpers

    @BeforeEach
    void setUp() throws Exception {
        service = new GoogleCalendarService(mockCalendar, CALENDAR_ID);

        when(mockCalendar.events()).thenReturn(mockEvents);
        when(mockEvents.list(CALENDAR_ID)).thenReturn(mockList);
        when(mockList.setPrivateExtendedProperty(any())).thenReturn(mockList);
        when(mockList.setShowDeleted(false)).thenReturn(mockList);
        when(mockList.setPageToken(any())).thenReturn(mockList);
    }

    private Events calendarWithEvents(List<Event> items) {
        Events response = new Events();
        response.setItems(items);
        return response;
    }

    private Event existingEvent(String ageeiId, String googleEventId) {
        Event event = new Event();
        event.setId(googleEventId);
        event.setExtendedProperties(
                new Event.ExtendedProperties().setPrivate(Map.of("ageeiId", ageeiId, "ageeiEventSource", "ageei-cms")));
        return event;
    }

    private String directusJson(String... eventJsons) {
        return "{\"data\":[" + String.join(",", eventJsons) + "]}";
    }

    private String eventJson(String id, String title, String startDate, String endDate) {
        String end = endDate != null ? "\"" + endDate + "\"" : "null";
        return String.format("{\"id\":\"%s\",\"title\":\"%s\",\"start_date\":\"%s\",\"end_date\":%s}", id, title,
                startDate, end);
    }

    //endregion

    //region insert / update / delete

    private Event syncAndCapture(String json) throws Exception {
        when(mockList.execute()).thenReturn(calendarWithEvents(new ArrayList<>()));
        when(mockEvents.insert(eq(CALENDAR_ID), any())).thenReturn(mockInsert);
        when(mockInsert.execute()).thenReturn(new Event());

        service.syncFromDirectus(MAPPER.readTree(json), LOGGER);

        ArgumentCaptor<Event> captor = ArgumentCaptor.forClass(Event.class);
        verify(mockEvents).insert(eq(CALENDAR_ID), captor.capture());
        return captor.getValue();
    }

    @Test
    void insertsNewEvent() throws Exception {
        Event inserted =
                syncAndCapture(directusJson(eventJson("id1", "CTF", "2026-04-07T10:00:00", "2026-04-07T23:59:00")));

        assertEquals("CTF", inserted.getSummary());
        assertEquals("id1", inserted.getExtendedProperties().getPrivate().get("ageeiId"));
    }

    @Test
    void updatesExistingEvent() throws Exception {
        when(mockList.execute()).thenReturn(calendarWithEvents(List.of(existingEvent("id1", "google-evt-1"))));
        when(mockEvents.update(eq(CALENDAR_ID), eq("google-evt-1"), any())).thenReturn(mockUpdate);
        when(mockUpdate.execute()).thenReturn(new Event());

        service.syncFromDirectus(MAPPER.readTree(
                directusJson(eventJson("id1", "CTF Updated", "2026-04-07T10:00:00", "2026-04-07T23:59:00"))), LOGGER);

        verify(mockEvents).update(eq(CALENDAR_ID), eq("google-evt-1"), any());
        verify(mockEvents, never()).insert(any(), any());
    }

    @Test
    void deletesRemovedEvent() throws Exception {
        when(mockList.execute()).thenReturn(calendarWithEvents(List.of(existingEvent("id-gone", "google-evt-gone"))));
        when(mockEvents.delete(eq(CALENDAR_ID), eq("google-evt-gone"))).thenReturn(mockDelete);

        service.syncFromDirectus(MAPPER.readTree("{\"data\":[]}"), LOGGER);

        verify(mockEvents).delete(CALENDAR_ID, "google-evt-gone");
        verify(mockEvents, never()).insert(any(), any());
    }

    @Test
    void handlesEmptyDirectusResponse() throws Exception {
        when(mockList.execute()).thenReturn(calendarWithEvents(new ArrayList<>()));

        service.syncFromDirectus(MAPPER.readTree("{\"data\":[]}"), LOGGER);

        verify(mockEvents, never()).insert(any(), any());
        verify(mockEvents, never()).update(any(), any(), any());
        verify(mockEvents, never()).delete(any(), any());
    }

    //endregion

    //region event timing

    @Test
    void syncFromDirectus_whenNoDataArray_doesNothing() throws Exception {
        service.syncFromDirectus(MAPPER.readTree("{\"foo\":\"bar\"}"), LOGGER);

        verify(mockCalendar, never()).events();
    }

    @Test
    void nullEndDateDefaultsToOneHourAfterStart() throws Exception {
        Event inserted = syncAndCapture(directusJson(eventJson("id1", "Solo Event", "2026-04-07T10:00:00", null)));

        long startMs = inserted.getStart().getDateTime().getValue();
        long endMs = inserted.getEnd().getDateTime().getValue();
        assertEquals(60 * 60 * 1000L, endMs - startMs, "End should be exactly 1 hour after start");
    }

    //endregion

    //region description / link

    @Test
    void explicitEndDateIsUsed() throws Exception {
        Event inserted = syncAndCapture(
                directusJson(eventJson("id1", "Long Event", "2026-04-07T10:00:00", "2026-04-07T12:00:00")));

        long startMs = inserted.getStart().getDateTime().getValue();
        long endMs = inserted.getEnd().getDateTime().getValue();
        assertEquals(2 * 60 * 60 * 1000L, endMs - startMs, "End should be 2 hours after start");
    }

    @Test
    void descriptionAndLinkUrlAppended() throws Exception {
        String json = """
                {"data":[{"id":"id1","title":"CTF","start_date":"2026-04-07T10:00:00","end_date":null,
                "description":"Chasse aux oeufs","link_url":"https://easter.ageei.org","link_label":"Relever le défi"}]}
                """;
        String description = syncAndCapture(json).getDescription();

        assertTrue(description.contains("Chasse aux oeufs"));
        assertTrue(description.contains("Relever le défi"));
        assertTrue(description.contains("https://easter.ageei.org"));
    }

    @Test
    void nullDescriptionField_hasNoDescription() throws Exception {
        String json = "{\"data\":[{\"id\":\"id1\",\"title\":\"T\",\"description\":null," +
                "\"start_date\":\"2026-04-07T10:00:00\",\"end_date\":null}]}";
        assertNull(syncAndCapture(json).getDescription());
    }

    @Test
    void absentDescriptionField_hasNoDescription() throws Exception {
        String json = "{\"data\":[{\"id\":\"id1\",\"title\":\"No Desc\"," +
                "\"start_date\":\"2026-04-07T10:00:00\",\"end_date\":null}]}";
        assertNull(syncAndCapture(json).getDescription());
    }

    @Test
    void nullLinkUrlField_noLinkAppended() throws Exception {
        String json = "{\"data\":[{\"id\":\"id1\",\"title\":\"T\",\"description\":\"Desc\"," +
                "\"link_url\":null,\"start_date\":\"2026-04-07T10:00:00\",\"end_date\":null}]}";
        assertEquals("Desc", syncAndCapture(json).getDescription());
    }

    @Test
    void linkUrlWithNullLinkLabel_usesUrlAsLabel() throws Exception {
        String json = "{\"data\":[{\"id\":\"id1\",\"title\":\"T\"," +
                "\"description\":null,\"link_url\":\"https://easter.ageei.org\",\"link_label\":null," +
                "\"start_date\":\"2026-04-07T10:00:00\",\"end_date\":null}]}";
        String description = syncAndCapture(json).getDescription();
        assertTrue(description.contains("https://easter.ageei.org: https://easter.ageei.org"));
    }

    @Test
    void linkUrlWithAbsentLinkLabel_usesUrlAsLabel() throws Exception {
        String json = "{\"data\":[{\"id\":\"id1\",\"title\":\"T\",\"description\":\"Desc\"," +
                "\"link_url\":\"https://easter.ageei.org\"," +
                "\"start_date\":\"2026-04-07T10:00:00\",\"end_date\":null}]}";
        String description = syncAndCapture(json).getDescription();
        assertTrue(description.contains("https://easter.ageei.org: https://easter.ageei.org"));
    }

    //endregion

    //region skip conditions

    @Test
    void linkUrlWithNoDescription_noLeadingNewlines() throws Exception {
        String json = "{\"data\":[{\"id\":\"id1\",\"title\":\"CTF\"," +
                "\"description\":null,\"link_url\":\"https://easter.ageei.org\",\"link_label\":\"Relever le défi\"," +
                "\"start_date\":\"2026-04-07T10:00:00\",\"end_date\":null}]}";
        String description = syncAndCapture(json).getDescription();
        assertFalse(description.startsWith("\n"));
        assertTrue(description.startsWith("Relever le défi"));
    }

    //endregion

    //region getExistingAgeeiEvents: skipping unindexable calendar events

    @Test
    void skipsEventWithNoId() throws Exception {
        when(mockList.execute()).thenReturn(calendarWithEvents(new ArrayList<>()));

        service.syncFromDirectus(MAPPER.readTree(
                "{\"data\":[{\"title\":\"No ID\",\"start_date\":\"2026-04-07T10:00:00\",\"end_date\":null}]}"), LOGGER);

        verify(mockEvents, never()).insert(any(), any());
    }

    @Test
    void existingEventWithNullExtendedProperties_isSkipped() throws Exception {
        Event eventNoEp = new Event();
        eventNoEp.setId("google-evt-no-ep");

        when(mockList.execute()).thenReturn(calendarWithEvents(List.of(eventNoEp)));
        when(mockEvents.insert(eq(CALENDAR_ID), any())).thenReturn(mockInsert);
        when(mockInsert.execute()).thenReturn(new Event());

        service.syncFromDirectus(MAPPER.readTree(directusJson(eventJson("id1", "Event", "2026-04-07T10:00:00", null))),
                LOGGER);

        verify(mockEvents).insert(eq(CALENDAR_ID), any());
        verify(mockEvents, never()).delete(any(), any());
    }

    @Test
    void existingEventWithNullPrivateMap_isSkipped() throws Exception {
        Event eventNullPrivate = new Event();
        eventNullPrivate.setId("google-evt-null-private");
        eventNullPrivate.setExtendedProperties(new Event.ExtendedProperties());

        when(mockList.execute()).thenReturn(calendarWithEvents(List.of(eventNullPrivate)));
        when(mockEvents.insert(eq(CALENDAR_ID), any())).thenReturn(mockInsert);
        when(mockInsert.execute()).thenReturn(new Event());

        service.syncFromDirectus(MAPPER.readTree(directusJson(eventJson("id1", "Event", "2026-04-07T10:00:00", null))),
                LOGGER);

        verify(mockEvents).insert(eq(CALENDAR_ID), any());
        verify(mockEvents, never()).delete(any(), any());
    }

    @Test
    void existingEventWithNullAgeeiId_isSkipped() throws Exception {
        Event eventNoId = new Event();
        eventNoId.setId("google-evt-no-ageei-id");
        eventNoId.setExtendedProperties(
                new Event.ExtendedProperties().setPrivate(Map.of("ageeiEventSource", "ageei-cms")));

        when(mockList.execute()).thenReturn(calendarWithEvents(List.of(eventNoId)));
        when(mockEvents.insert(eq(CALENDAR_ID), any())).thenReturn(mockInsert);
        when(mockInsert.execute()).thenReturn(new Event());

        service.syncFromDirectus(MAPPER.readTree(directusJson(eventJson("id1", "Event", "2026-04-07T10:00:00", null))),
                LOGGER);

        verify(mockEvents).insert(eq(CALENDAR_ID), any());
        verify(mockEvents, never()).delete(any(), any());
    }

    //endregion

    //region pagination

    @Test
    void existingEventWithBlankAgeeiId_isSkipped() throws Exception {
        HashMap<String, String> props = new HashMap<>();
        props.put("ageeiId", "   ");
        props.put("ageeiEventSource", "ageei-cms");

        Event eventBlankId = new Event();
        eventBlankId.setId("google-evt-blank-id");
        eventBlankId.setExtendedProperties(new Event.ExtendedProperties().setPrivate(props));

        when(mockList.execute()).thenReturn(calendarWithEvents(List.of(eventBlankId)));
        when(mockEvents.insert(eq(CALENDAR_ID), any())).thenReturn(mockInsert);
        when(mockInsert.execute()).thenReturn(new Event());

        service.syncFromDirectus(MAPPER.readTree(directusJson(eventJson("id1", "Event", "2026-04-07T10:00:00", null))),
                LOGGER);

        verify(mockEvents).insert(eq(CALENDAR_ID), any());
        verify(mockEvents, never()).delete(any(), any());
    }

    //endregion

    //region constructor validation

    @Test
    void handlesPaginatedCalendarResponse() throws Exception {
        Events page1 = calendarWithEvents(List.of(existingEvent("id1", "google-evt-1")));
        page1.setNextPageToken("page-2-token");
        Events page2 = calendarWithEvents(new ArrayList<>());

        when(mockList.execute()).thenReturn(page1).thenReturn(page2);
        when(mockEvents.update(eq(CALENDAR_ID), eq("google-evt-1"), any())).thenReturn(mockUpdate);
        when(mockUpdate.execute()).thenReturn(new Event());

        service.syncFromDirectus(MAPPER.readTree(directusJson(eventJson("id1", "Event", "2026-04-07T10:00:00", null))),
                LOGGER);

        verify(mockList, times(2)).execute();
        verify(mockEvents).update(eq(CALENDAR_ID), eq("google-evt-1"), any());
    }

    @Test
    void constructor_nullServiceAccountKey_throwsIllegalState() {
        assertThrows(IllegalStateException.class, () -> makeServiceWithEnv(null, "cal@group.calendar.google.com"));
    }

    @Test
    void constructor_blankServiceAccountKey_throwsIllegalState() {
        assertThrows(IllegalStateException.class, () -> makeServiceWithEnv("   ", "cal@group.calendar.google.com"));
    }

    @Test
    void constructor_nullCalendarId_throwsIllegalState() {
        assertThrows(IllegalStateException.class, () -> makeServiceWithEnv("dGVzdA==", null));
    }

    @Test
    void constructor_blankCalendarId_throwsIllegalState() {
        assertThrows(IllegalStateException.class, () -> makeServiceWithEnv("dGVzdA==", "  "));
    }

    @Test
    void constructor_nullImpersonatedUser_throwsIllegalState() {
        assertThrows(IllegalStateException.class,
                () -> makeServiceWithEnv("dGVzdA==", "cal@group.calendar.google.com", null));
    }

    @Test
    void constructor_blankImpersonatedUser_throwsIllegalState() {
        assertThrows(IllegalStateException.class,
                () -> makeServiceWithEnv("dGVzdA==", "cal@group.calendar.google.com", "  "));
    }

    @Test
    void constructor_invalidBase64Key_throwsIllegalArgument() {
        assertThrows(IllegalArgumentException.class,
                () -> makeServiceWithEnv("not valid base64!!!", "cal@group.calendar.google.com"));
    }

    //endregion

    //region getEnv

    @Test
    void getEnv_delegatesToSystemGetenv() {
        GoogleCalendarService svc = new GoogleCalendarService(mockCalendar, CALENDAR_ID);
        assertEquals(System.getenv("PATH"), svc.getEnv("PATH"));
        assertNull(svc.getEnv("AGEEI_THIS_VAR_DOES_NOT_EXIST"));
    }
    //endregion
}
