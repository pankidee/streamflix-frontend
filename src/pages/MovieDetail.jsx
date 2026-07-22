import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/movies/${id}`)
      .then((res) => setMovie(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div><Navbar /><LoadingSpinner /></div>;
  if (!movie) return <div><Navbar /><p className="empty-state">Movie not found.</p></div>;

  return (
    <div>
      <Navbar />
      <div className="detail-page">
        <div
          className="detail-hero"
          style={{ backgroundImage: `url(${movie.posterUrl || '/poster-placeholder.svg'})` }}
        >
          <div className="detail-overlay">
            <div className="detail-content">
              <h1>{movie.title}</h1>
              <div className="detail-meta">
                {movie.vj && <span className="hero-vj-badge">{movie.vj}</span>}
                {movie.genre && <span className="detail-genre">{movie.genre}</span>}
                {movie.releaseYear && <span className="detail-year">{movie.releaseYear}</span>}
              </div>
              <p className="detail-description">{movie.description}</p>
              <button className="btn-play" onClick={() => navigate(`/watch/${movie.id}`)}>
                ▶ Play
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}