package ticket.booking.service;

import org.junit.Test;
import ticket.booking.entities.User;

import java.lang.reflect.Field;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class JwtServiceTest {

    @Test
    public void generatesValidTokenForUser() throws Exception {
        JwtService jwtService = new JwtService();
        setField(jwtService, "jwtSecret", "ticket-booking-development-jwt-secret-key-change-me-123456");
        setField(jwtService, "jwtExpirationMs", 60000L);

        User user = User.builder()
                .userId("user-123")
                .name("tester")
                .build();

        String token = jwtService.generateToken(user);

        assertEquals("user-123", jwtService.extractUserId(token));
        assertTrue(jwtService.isTokenValid(token, user));
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}