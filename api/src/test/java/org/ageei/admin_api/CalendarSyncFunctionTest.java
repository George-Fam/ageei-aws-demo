package org.ageei.admin_api;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.azure.functions.ExecutionContext;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;
import com.microsoft.azure.functions.HttpStatus;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.Optional;
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
class CalendarSyncFunctionTest {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Mock
    HttpRequestMessage<Optional<String>> mockRequest;
    @Mock
    HttpResponseMessage.Builder mockBuilder;
    @Mock
    HttpResponseMessage mockResponse;
    @Mock
    ExecutionContext mockContext;
    @Mock
    Logger mockLogger;
    @Mock
    HttpClient mockHttpClient;
    @Mock
    GoogleCalendarService mockCalendarService;
    @SuppressWarnings("unchecked")
    @Mock
    HttpResponse<String> mockHttpResponse;

    @BeforeEach
    void setUp() {
        when(mockContext.getLogger()).thenReturn(mockLogger);
        when(mockRequest.createResponseBuilder(any(HttpStatus.class))).thenReturn(mockBuilder);
        when(mockBuilder.body(any())).thenReturn(mockBuilder);
        when(mockBuilder.build()).thenReturn(mockResponse);
    }

    /**
     * Creates a spy with WEBHOOK_SECRET stubbed via the package-private getEnv() hook.
     */
    private CalendarSyncFunction functionWithSecret(String secret) {
        CalendarSyncFunction f = spy(new CalendarSyncFunction());
        doReturn(secret).when(f).getEnv("WEBHOOK_SECRET");
        return f;
    }

    //region secret validation

    @Test
    void syncCalendar_whenWebhookSecretEnvNotSet_returns401() {
        CalendarSyncFunction function = functionWithSecret(null);
        when(mockRequest.getHeaders()).thenReturn(Map.of("x-webhook-secret", "anything"));

        function.syncCalendar(mockRequest, mockContext);

        verify(mockRequest).createResponseBuilder(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void syncCalendar_whenHeaderMissing_returns401() {
        CalendarSyncFunction function = functionWithSecret("correct-secret");
        when(mockRequest.getHeaders()).thenReturn(Map.of());

        function.syncCalendar(mockRequest, mockContext);

        verify(mockRequest).createResponseBuilder(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void syncCalendar_whenWrongSecret_returns401() {
        CalendarSyncFunction function = functionWithSecret("correct-secret");
        when(mockRequest.getHeaders()).thenReturn(Map.of("x-webhook-secret", "wrong-secret"));

        function.syncCalendar(mockRequest, mockContext);

        verify(mockRequest).createResponseBuilder(HttpStatus.UNAUTHORIZED);
    }

    //endregion

    //region happy path / error path

    @Test
    void syncCalendar_whenCorrectSecret_returns200() throws Exception {
        CalendarSyncFunction function = functionWithSecret("correct-secret");
        when(mockRequest.getHeaders()).thenReturn(Map.of("x-webhook-secret", "correct-secret"));
        doNothing().when(function).performSync(mockContext);

        function.syncCalendar(mockRequest, mockContext);

        verify(function).performSync(mockContext);
        verify(mockRequest).createResponseBuilder(HttpStatus.OK);
    }

    @Test
    void syncCalendar_whenSyncThrows_returns500() throws Exception {
        CalendarSyncFunction function = functionWithSecret("correct-secret");
        when(mockRequest.getHeaders()).thenReturn(Map.of("x-webhook-secret", "correct-secret"));
        doThrow(new RuntimeException("Directus down")).when(function).performSync(mockContext);

        function.syncCalendar(mockRequest, mockContext);

        verify(mockRequest).createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //endregion

    //region timer trigger

    @Test
    void syncCalendarScheduled_callsPerformSync() throws Exception {
        CalendarSyncFunction function = spy(new CalendarSyncFunction());
        doNothing().when(function).performSync(mockContext);

        function.syncCalendarScheduled("", mockContext);

        verify(function).performSync(mockContext);
    }

    @Test
    void syncCalendarScheduled_whenSyncThrows_doesNotPropagate() throws Exception {
        CalendarSyncFunction function = spy(new CalendarSyncFunction());
        doThrow(new RuntimeException("network error")).when(function).performSync(mockContext);

        assertDoesNotThrow(() -> function.syncCalendarScheduled("", mockContext));
        verify(mockLogger).severe(contains("network error"));
    }

    //endregion

    //region getEnv

    @Test
    void getEnv_delegatesToSystemGetenv() {
        CalendarSyncFunction f = new CalendarSyncFunction();
        assertEquals(System.getenv("PATH"), f.getEnv("PATH"));
        assertNull(f.getEnv("AGEEI_THIS_VAR_DOES_NOT_EXIST"));
    }

    //endregion

    //region fetchEventsFromDirectus

    private CalendarSyncFunction spyWithHttpMock() throws Exception {
        CalendarSyncFunction f = spy(new CalendarSyncFunction());
        doReturn(mockHttpClient).when(f).newHttpClient();
        doReturn("https://cms.ageei.org").when(f).getEnv("DIRECTUS_URL");
        return f;
    }

    @Test
    void fetchEventsFromDirectus_whenDirectusUrlNotSet_throws() {
        CalendarSyncFunction f = spy(new CalendarSyncFunction());
        doReturn(null).when(f).getEnv("DIRECTUS_URL");

        assertThrows(IllegalStateException.class, () -> f.fetchEventsFromDirectus(mockContext));
    }

    @Test
    void fetchEventsFromDirectus_whenNon200Response_throws() throws Exception {
        CalendarSyncFunction f = spyWithHttpMock();
        doReturn(mockHttpResponse).when(mockHttpClient).send(any(), any());
        when(mockHttpResponse.statusCode()).thenReturn(404);

        assertThrows(RuntimeException.class, () -> f.fetchEventsFromDirectus(mockContext));
    }

    @Test
    void fetchEventsFromDirectus_whenSuccess_returnsParsedJson() throws Exception {
        CalendarSyncFunction f = spyWithHttpMock();
        doReturn(mockHttpResponse).when(mockHttpClient).send(any(), any());
        when(mockHttpResponse.statusCode()).thenReturn(200);
        when(mockHttpResponse.body()).thenReturn("{\"data\":[]}");

        var result = f.fetchEventsFromDirectus(mockContext);

        assertTrue(result.has("data"));
        assertTrue(result.get("data").isArray());
    }

    @Test
    void fetchEventsFromDirectus_filtersOutDraftEvents() throws Exception {
        CalendarSyncFunction f = spyWithHttpMock();
        doReturn(mockHttpResponse).when(mockHttpClient).send(any(), any());
        when(mockHttpResponse.statusCode()).thenReturn(200);
        when(mockHttpResponse.body()).thenReturn("{\"data\":[]}");

        f.fetchEventsFromDirectus(mockContext);

        ArgumentCaptor<HttpRequest> requestCaptor = ArgumentCaptor.forClass(HttpRequest.class);
        verify(mockHttpClient).send(requestCaptor.capture(), any());
        assertTrue(requestCaptor.getValue().uri().getRawQuery().contains("filter%5BisDraft%5D%5B_neq%5D=true"));
    }

    //endregion

    //region performSync

    @Test
    void performSync_fetchesEventsAndSyncsToCalendar() throws Exception {
        CalendarSyncFunction f = spy(new CalendarSyncFunction());
        doReturn(MAPPER.readTree("{\"data\":[]}")).when(f).fetchEventsFromDirectus(mockContext);
        doReturn(mockCalendarService).when(f).newGoogleCalendarService();

        f.performSync(mockContext);

        verify(mockCalendarService).syncFromDirectus(any(), eq(mockLogger));
    }
    //endregion
}
