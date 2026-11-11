package com.ainative.favorites.repository;

import com.ainative.favorites.model.Favorite;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserIdAndMovieId(String userId, String movieId);

    List<Favorite> findByUserIdOrderByCreatedAtDesc(String userId);

    boolean existsByUserIdAndMovieId(String userId, String movieId);

    void deleteByUserIdAndMovieId(String userId, String movieId);
}
