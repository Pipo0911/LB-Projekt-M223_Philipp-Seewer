package ch.wiss.m295.steamlibrary.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.LinkedHashMap;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;
/**
 * Global exception handler for the REST API.
 * <p>
 * Converts common exceptions (e.g. validation, data integrity) into consistent JSON error responses.
 * </p>
 */

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "Validation_Failed");
        body.put("fields", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "DATA_INTEGRITY_VIOLATION");
        body.put("message", "Ein Eintrag verletzt eine Datenbank-Constraint (z.B. steamAppId muss eindeutig sein).");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body); 
    }
}
