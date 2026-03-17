package com.paystride.util;

import java.util.regex.Pattern;

public final class PasswordValidationUtil {

    private static final Pattern STRONG_PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$"
    );

    private PasswordValidationUtil() {
    }

    public static boolean isStrongPassword(String password) {
        return password != null && STRONG_PASSWORD_PATTERN.matcher(password).matches();
    }

    public static String getRequirementsMessage() {
        return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
    }
}
