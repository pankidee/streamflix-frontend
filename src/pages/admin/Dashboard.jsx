import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import AdminMovieRow from '../../components/AdminMovieRow';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seriesList, setSeriesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/series', { params: { all: true } }).then((res) => setSeriesList(res.data));
  }, []);

  const loadMovies = () => {
    setLoading(true);
    api.get('/api/movies')
      .then((res) => setMovies(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleDelete = async (movie) => {
    const confirmed = window.confirm(`Delete "${movie.title}"? This cannot be undone.`);
    if (!confirmed) return;
    await api.delete(`/api/movies/${movie.id}`);
    setMovies((prev) => prev.filter((m) => m.id !== movie.id));
  };

  const handleEdit = (movie) => navigate(`/admin/edit/${movie.id}`);

  return (
    <div>
      <Navbar />
      <main>
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/admin/upload" className="btn-primary">+ Upload Movie</Link>
            <Link to="/admin/series/new" className="btn-primary">+ Create Series</Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Table layout — shown on wider screens */}
            <table className="admin-table admin-table-desktop">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>VJ</th>
                  <th>Genre</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <AdminMovieRow key={movie.id} movie={movie} onDelete={handleDelete} onEdit={handleEdit} />
                ))}
              </tbody>
            </table>

            {/* Card layout — shown on narrow screens */}
            <div className="admin-cards-mobile">
              {movies.map((movie) => (
                <div key={movie.id} className="admin-card">
                  <img
                    src={movie.posterUrl || '/poster-placeholder.svg'}
                    alt={movie.title}
                    onError={(e) => { e.target.src = '/poster-placeholder.svg'; }}
                  />
                  <div className="admin-card-info">
                    <p className="admin-card-title">{movie.title}</p>
                    <p className="admin-card-meta">{movie.vj || '—'} · {movie.genre || '—'}</p>
                    <p className="admin-card-status">
                      {movie.videoPlaylistUrl ? 'Ready' : 'No video'}
                    </p>
                    <div className="admin-card-actions">
                      <button onClick={() => handleEdit(movie)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(movie)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 style={{ marginTop: '2.5rem' }}>Series</h2>
        {seriesList.length === 0 && <p className="empty-state">No series yet.</p>}
        <div className="admin-cards-mobile">
          {seriesList.map((s) => (
            <div key={s.id} className="admin-card">
              <img
                src={s.posterUrl || '/poster-placeholder.svg'}
                alt={s.title}
                onError={(e) => { e.target.src = '/poster-placeholder.svg'; }}
              />
              <div className="admin-card-info">
                <p className="admin-card-title">{s.title}</p>
                <p className="admin-card-meta">{s.vj || '—'}</p>
                <div className="admin-card-actions">
                  <Link to={`/admin/series/${s.id}/episodes`} className="btn-secondary">Manage Episodes</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}