package ch.wiss.m223.steamlibrary.exception;

/**
 * Wird geworfen, wenn eine angeforderte Ressource (z.B. ein Spiel oder Benutzer)
 * nicht existiert. Wird vom {@code GlobalExceptionHandler} in einen
 * HTTP-404-Response übersetzt.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
