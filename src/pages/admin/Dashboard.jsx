import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import AdminMovieRow from '../../components/AdminMovieRow';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          <Link to="/admin/upload" className="btn-primary">+ Upload Movie</Link>
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
      </main>
    </div>
  );
}