import { Link } from 'react-router-dom';

export default function HeroBanner({ movie }) {
  if (!movie) return null;

  return (
    <div
      className="hero-banner"
      style={{ backgroundImage: `url(${movie.posterUrl || '/poster-placeholder.svg'})` }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>{movie.title}</h1>
          {movie.vj && <span className="hero-vj-badge">{movie.vj}</span>}
          {movie.description && <p className="hero-description">{movie.description}</p>}
          <Link to={`/watch/${movie.id}`} className="btn-play">▶ Play</Link>
        </div>
      </div>
    </div>
  );
}