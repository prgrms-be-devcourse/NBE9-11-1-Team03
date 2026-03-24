package com.back.team03.javachip.global.exception;

public record ErrorResponse(
        int status,
        String message
) {}