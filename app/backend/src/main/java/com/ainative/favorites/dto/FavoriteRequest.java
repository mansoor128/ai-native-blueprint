package com.ainative.favorites.dto;

import jakarta.validation.constraints.NotBlank;

public record FavoriteRequest(@NotBlank String movieId) {}
