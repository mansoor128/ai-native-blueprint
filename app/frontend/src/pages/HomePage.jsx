import { MOVIES } from "../data/movies";
import MovieCard from "../components/MovieCard";

export default function HomePage({ favoriteIds }) {
  return (
    <section className="page">
      <header className="page-intro">
        <p className="eyebrow">Browse</p>
        <h1>Tonight&apos;s picks</h1>
        <p className="lede">
          Tap the heart on any card to save it to My List — TASK-02 in action.
        </p>
      </header>
      <div className="movie-grid">
        {MOVIES.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            favorited={favoriteIds.has(movie.id)}
          />
        ))}
      </div>
    </section>
  );
}
