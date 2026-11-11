package com.ainative.favorites.web;

import com.ainative.favorites.dto.FavoriteRequest;
import com.ainative.favorites.dto.FavoriteResponse;
import com.ainative.favorites.service.FavoriteService;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/favorites")
public class FavoriteController {

    private static final Logger log = LoggerFactory.getLogger(FavoriteController.class);

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public FavoriteResponse toggle(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @Valid @RequestBody FavoriteRequest request) {
        String authenticatedUser = requireUser(userId);
        MDC.put("userId", hash(authenticatedUser));
        try {
            FavoriteResponse response = favoriteService.toggle(authenticatedUser, request.movieId());
            log.info("favorites.toggle movieId={} favorited={}", request.movieId(), response.favorited());
            return response;
        } finally {
            MDC.remove("userId");
        }
    }

    @GetMapping
    public List<FavoriteResponse> list(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        String authenticatedUser = requireUser(userId);
        return favoriteService.listForUser(authenticatedUser);
    }

    @DeleteMapping("/{movieId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable String movieId) {
        String authenticatedUser = requireUser(userId);
        favoriteService.remove(authenticatedUser, movieId);
        log.info("favorites.remove movieId={}", movieId);
    }

    private static String requireUser(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return userId.trim();
    }

    private static String hash(String userId) {
        return Integer.toHexString(userId.hashCode());
    }
}
