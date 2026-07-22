import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const VJ_OPTIONS = ['VJ Junior', 'VJ Emmy', 'VJ Ice P', 'VJ Jingo', 'VJ Kevo', 'VJ Ulio'];

export default function UploadSeries() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', posterUrl: '', genre: '', releaseYear: '', vj: VJ_OPTIONS[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/series', form);
      navigate(`/admin/series/${res.data.id}/episodes`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create series');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-form-page">
        <h1>Create Series</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />

          <label>Poster Image URL</label>
          <input name="posterUrl" value={form.posterUrl} onChange={handleChange} required />

          <label>Genre</label>
          <input name="genre" value={form.genre} onChange={handleChange} />

          <label>Release Year</label>
          <input name="releaseYear" type="number" value={form.releaseYear} onChange={handleChange} />

          <label>VJ</label>
          <select name="vj" value={form.vj} onChange={handleChange}>
            {VJ_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Series & Add Episodes'}
          </button>
        </form>
      </div>
    </div>
  );
}