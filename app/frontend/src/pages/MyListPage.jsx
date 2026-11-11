import { useEffect, useState } from "react";
import { listFavorites, removeFavorite } from "../api";
import { MOVIES } from "../data/movies";

export default function MyListPage({ onChanged }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listFavorites();
        if (!cancelled) {
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRemove(movieId) {
    await removeFavorite(movieId);
    setItems((current) => current.filter((item) => item.movieId !== movieId));
    onChanged?.();
  }

  const enriched = items
    .map((fav) => ({
      ...fav,
      movie: MOVIES.find((m) => m.id === fav.movieId),
    }))
    .filter((row) => row.movie);

  return (
    <section className="page">
      <header className="page-intro">
        <p className="eyebrow">My List</p>
        <h1>Saved for later</h1>
        <p className="lede">Movies you favorited — TASK-04 in action.</p>
      </header>

      {loading ? <p className="status">Loading…</p> : null}
      {error ? <p className="status error">{error}</p> : null}

      {!loading && !error && enriched.length === 0 ? (
        <p className="empty">No favorites yet. Heart a movie on Browse to start your list.</p>
      ) : null}

      <div className="movie-grid">
        {enriched.map(({ movie }) => (
          <article key={movie.id} className="movie-card">
            <div className="poster-plane">
              <img src={movie.poster} alt="" />
            </div>
            <div className="movie-meta">
              <h2>{movie.title}</h2>
              <p>{movie.year}</p>
              <button
                type="button"
                className="text-button"
                onClick={() => handleRemove(movie.id)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
