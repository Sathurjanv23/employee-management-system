package com.example.backend.security;

import java.util.regex.Pattern;

public final class PasswordPolicy {

    private static final Pattern PASSWORD_PATTERN = Pattern
            .compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");

    private static final String POLICY_MESSAGE =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";

    private PasswordPolicy() {
        // Utility class
    }

    public static boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }

    public static void validateOrThrow(String password) {
        if (!isValidPassword(password)) {
            throw new RuntimeException(POLICY_MESSAGE);
        }
    }
}
