package ch.wiss.m223.steamlibrary.controller;

import ch.wiss.m223.steamlibrary.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Zentrale Fehlerbehandlung für das REST-API.
 * <p>
 * Übersetzt häufige Exceptions in einheitliche JSON-Fehlerantworten
 * (deutsche Meldungen, stabile {@code error}-Codes).
 * </p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Bean-Validation-Fehler → 400 mit Feld-Detailmeldungen. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "VALIDATION_FAILED");
        body.put("fields", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    /** Nicht gefundene Ressource → 404. */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "NOT_FOUND");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    /** Verletzte Datenbank-Constraint (z.B. doppelte steamAppId) → 409. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "DATA_INTEGRITY_VIOLATION");
        body.put("message", "Ein Eintrag verletzt eine Datenbank-Constraint (z.B. steamAppId muss eindeutig sein).");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }
}
