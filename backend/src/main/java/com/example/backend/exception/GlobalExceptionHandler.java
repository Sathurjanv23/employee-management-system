package com.example.backend.exception;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        String msg = e.getMessage();
        if (msg != null && msg.contains("not found")) {
            return ResponseEntity.status(404).body(Map.of("error", msg));
        }
        if (msg != null && (msg.contains("Invalid") || msg.contains("Unauthorized"))) {
            return ResponseEntity.status(401).body(Map.of("error", msg));
        }
        return ResponseEntity.status(400).body(Map.of("error", msg != null ? msg : "Bad request"));
    }
}
