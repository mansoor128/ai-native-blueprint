package com.ainative.favorites.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.ainative.favorites.dto.FavoriteResponse;
import com.ainative.favorites.repository.FavoriteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import(FavoriteService.class)
class FavoriteServiceTest {

    @Autowired private FavoriteService favoriteService;
    @Autowired private FavoriteRepository favoriteRepository;

    @Test
    void togglingTwiceRemovesFavorite() {
        FavoriteResponse first = favoriteService.toggle("user-1", "movie-42");
        assertThat(first.favorited()).isTrue();
        assertThat(favoriteRepository.existsByUserIdAndMovieId("user-1", "movie-42")).isTrue();

        FavoriteResponse second = favoriteService.toggle("user-1", "movie-42");
        assertThat(second.favorited()).isFalse();
        assertThat(favoriteRepository.existsByUserIdAndMovieId("user-1", "movie-42")).isFalse();
    }
}
