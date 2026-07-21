import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = () => {
    setLoading(true);
    api.get('/api/users/history')
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRemove = async (movieId) => {
    await api.delete(`/api/users/history/${movieId}`);
    setItems((prev) => prev.filter((m) => m.id !== movieId));
  };

  const formatProgress = (movie) => {
    if (!movie.progressSeconds) return null;
    const durationSeconds = (movie.durationMinutes || 0) * 60;
    if (!durationSeconds) return null;
    const pct = Math.min(100, Math.round((movie.progressSeconds / durationSeconds) * 100));
    return pct;
  };

  return (
    <div>
      <Navbar />
      <main>
        <h1 className="search-title">Continue Watching</h1>

        {loading && <LoadingSpinner />}

        {!loading && items.length === 0 && (
          <p className="empty-state">You haven't watched anything yet.</p>
        )}

        <div className="history-grid">
          {items.map((movie) => {
            const pct = formatProgress(movie);
            return (
              <div key={movie.id} className="history-card">
                <Link to={`/watch/${movie.id}`}>
                  <img
                    src={movie.posterUrl || '/poster-placeholder.svg'}
                    alt={movie.title}
                    onError={(e) => { e.target.src = '/poster-placeholder.svg'; }}
                  />
                  {pct !== null && (
                    <div className="history-progress-track">
                      <div className="history-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </Link>
                <div className="history-card-info">
                  <p className="movie-title">{movie.title}</p>
                  {movie.vj && <p className="movie-vj">{movie.vj}</p>}
                </div>
                <button className="history-remove-btn" onClick={() => handleRemove(movie.id)}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}