package com.ainative.favorites.service;

import com.ainative.favorites.dto.FavoriteResponse;
import com.ainative.favorites.model.Favorite;
import com.ainative.favorites.repository.FavoriteRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

    private final FavoriteRepository repository;

    public FavoriteService(FavoriteRepository repository) {
        this.repository = repository;
    }

    /**
     * Toggle behavior (TASK-01.3): first call adds; second call removes.
     */
    @Transactional
    public FavoriteResponse toggle(String userId, String movieId) {
        return repository
                .findByUserIdAndMovieId(userId, movieId)
                .map(
                        existing -> {
                            repository.delete(existing);
                            return new FavoriteResponse(movieId, false, null);
                        })
                .orElseGet(
                        () -> {
                            Favorite saved = repository.save(new Favorite(userId, movieId));
                            return new FavoriteResponse(movieId, true, saved.getCreatedAt());
                        });
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> listForUser(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(f -> new FavoriteResponse(f.getMovieId(), true, f.getCreatedAt()))
                .toList();
    }

    @Transactional
    public void remove(String userId, String movieId) {
        repository.deleteByUserIdAndMovieId(userId, movieId);
    }
}
