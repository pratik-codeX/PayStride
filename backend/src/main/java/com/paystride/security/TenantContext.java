package com.paystride.security;

public class TenantContext {

    private static final ThreadLocal<Long> CONTEXT = new ThreadLocal<>();

    public static void set(Long companyId) {
        CONTEXT.set(companyId);
    }

    public static Long get() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }
}

