import { useState } from "react";
import { toggleFavorite } from "../api";

export default function HeartButton({ movieId, initiallyFavorited = false }) {
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const previous = favorited;
    setFavorited(!previous);
    setPending(true);
    setError(null);

    try {
      const result = await toggleFavorite(movieId);
      setFavorited(result.favorited);
    } catch (err) {
      setFavorited(previous);
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="heart-wrap">
      <button
        type="button"
        className={`heart-button ${favorited ? "is-on" : ""}`}
        onClick={handleClick}
        aria-pressed={favorited}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        disabled={pending}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 21s-6.7-4.35-9.33-8.1C.7 10.1 1.2 6.6 4.05 5.1 6.2 4 8.55 4.55 10 6.2c1.45-1.65 3.8-2.2 5.95-1.1 2.85 1.5 3.35 5 1.38 7.8C18.7 16.65 12 21 12 21z"
            fill={favorited ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      </button>
      {error ? <span className="heart-error">{error}</span> : null}
    </div>
  );
}
