import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [vjOptions, setVjOptions] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/api/movies/${id}`).then((res) => setMovie(res.data));
    api.get('/api/movies/vjs').then((res) => setVjOptions(res.data));
  }, [id]);

  const handleChange = (field, value) => {
    setMovie((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/api/movies/${id}`, {
        title: movie.title,
        description: movie.description,
        posterUrl: movie.posterUrl,
        genre: movie.genre,
        releaseYear: movie.releaseYear,
        vj: movie.vj,
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setSaving(false);
    }
  };

  if (!movie) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div>
      <Navbar />
      <main>
        <h1>Edit Movie</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Title</label>
          <input value={movie.title || ''} onChange={(e) => handleChange('title', e.target.value)} required />

          <label>Description</label>
          <textarea value={movie.description || ''} onChange={(e) => handleChange('description', e.target.value)} />

          <label>Poster Image URL</label>
          <input value={movie.posterUrl || ''} onChange={(e) => handleChange('posterUrl', e.target.value)} />

          <label>Genre</label>
          <input value={movie.genre || ''} onChange={(e) => handleChange('genre', e.target.value)} />

          <label>Release Year</label>
          <input type="number" value={movie.releaseYear || ''} onChange={(e) => handleChange('releaseYear', e.target.value)} />

          <label>VJ</label>
          <select value={movie.vj || ''} onChange={(e) => handleChange('vj', e.target.value)} required>
            <option value="">Select a VJ...</option>
            {vjOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </main>
    </div>
  );
}