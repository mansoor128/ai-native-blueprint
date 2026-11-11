import HeartButton from "./HeartButton";

export default function MovieCard({ movie, favorited = false }) {
  return (
    <article className="movie-card">
      <div className="poster-plane">
        <img src={movie.poster} alt="" />
        <HeartButton movieId={movie.id} initiallyFavorited={favorited} />
      </div>
      <div className="movie-meta">
        <h2>{movie.title}</h2>
        <p>{movie.year}</p>
      </div>
    </article>
  );
}
