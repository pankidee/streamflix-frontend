import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageEpisodes() {
  const { seriesId } = useParams();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ seasonNumber: 1, episodeNumber: 1, title: '', durationMinutes: '' });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadSeries = () => {
    api.get(`/api/series/${seriesId}`).then((res) => setSeries(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadSeries(); }, [seriesId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setStatus('Please choose a video file.'); return; }
    setUploading(true);
    setStatus('Uploading & converting... this can take a while');

    const data = new FormData();
    data.append('seriesId', seriesId);
    data.append('seasonNumber', form.seasonNumber);
    data.append('episodeNumber', form.episodeNumber);
    data.append('title', form.title);
    data.append('durationMinutes', form.durationMinutes);
    data.append('video', file);

    try {
      await api.post('/api/series/episodes/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Episode added!');
      setForm({ seasonNumber: form.seasonNumber, episodeNumber: Number(form.episodeNumber) + 1, title: '', durationMinutes: '' });
      setFile(null);
      loadSeries();
    } catch (err) {
      setStatus(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEpisode = async (id) => {
    if (!confirm('Delete this episode?')) return;
    await api.delete(`/api/series/episodes/${id}`);
    loadSeries();
  };

  if (loading) return <div><Navbar /><LoadingSpinner /></div>;
  if (!series) return <div><Navbar /><p className="empty-state">Series not found.</p></div>;

  const episodes = (series.Episodes || []).slice().sort((a, b) =>
    a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber
  );

  return (
    <div>
      <Navbar />
      <div className="admin-form-page">
        <h1>{series.title} — Episodes</h1>
        <Link to="/admin" className="btn-secondary" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Back to Dashboard
        </Link>

        <h2 style={{ marginTop: '1rem' }}>Add Episode</h2>
        {status && <p className={status.includes('failed') || status.includes('Please') ? 'error' : 'status-message'}>{status}</p>}
        <form onSubmit={handleUpload} className="admin-form">
          <label>Season Number</label>
          <input name="seasonNumber" type="number" min="1" value={form.seasonNumber} onChange={handleChange} required />

          <label>Episode Number</label>
          <input name="episodeNumber" type="number" min="1" value={form.episodeNumber} onChange={handleChange} required />

          <label>Episode Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />

          <label>Duration (minutes)</label>
          <input name="durationMinutes" type="number" value={form.durationMinutes} onChange={handleChange} />

          <label>Video File</label>
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} required />

          <button type="submit" disabled={uploading} className="btn-primary">
            {uploading ? 'Uploading...' : 'Add Episode'}
          </button>
        </form>

        <h2 style={{ marginTop: '2.5rem' }}>Existing Episodes</h2>
        {episodes.length === 0 && <p className="empty-state">No episodes yet.</p>}
        <div className="episode-list">
          {episodes.map((ep) => (
            <div key={ep.id} className="episode-row">
              <div>
                <p className="movie-title">S{ep.seasonNumber} E{ep.episodeNumber} — {ep.title}</p>
                {ep.durationMinutes && <p className="movie-vj">{ep.durationMinutes} min</p>}
              </div>
              <button className="btn-danger" onClick={() => handleDeleteEpisode(ep.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}