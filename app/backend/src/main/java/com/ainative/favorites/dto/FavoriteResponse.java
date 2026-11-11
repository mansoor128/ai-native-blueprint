package com.ainative.favorites.dto;

import java.time.Instant;

public record FavoriteResponse(String movieId, boolean favorited, Instant createdAt) {}
