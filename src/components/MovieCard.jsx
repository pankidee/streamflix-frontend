import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const handleImgError = (e) => {
    e.target.src = '/poster-placeholder.svg';
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img
        src={movie.posterUrl || '/poster-placeholder.svg'}
        alt={movie.title}
        loading="lazy"
        onError={handleImgError}
      />
      <div className="movie-card-info">
        <p className="movie-title">{movie.title}</p>
        {movie.vj && <p className="movie-vj">{movie.vj}</p>}
      </div>
    </Link>
  );
}