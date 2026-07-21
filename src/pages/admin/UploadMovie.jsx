import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

export default function UploadMovie() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [vj, setVj] = useState('');
  const [vjOptions, setVjOptions] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/movies/vjs').then((res) => setVjOptions(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!videoFile) {
      setError('Please choose a video file');
      return;
    }
    if (!vj) {
      setError('Please select a VJ');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('posterUrl', posterUrl);
    formData.append('genre', genre);
    formData.append('releaseYear', releaseYear);
    formData.append('vj', vj);
    formData.append('video', videoFile);

    setUploading(true);
    try {
      await api.post('/api/movies/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main>
        <h1>Upload Movie</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <label>Poster Image URL</label>
          <input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} placeholder="https://..." />

          <label>Genre</label>
          <input value={genre} onChange={(e) => setGenre(e.target.value)} />

          <label>Release Year</label>
          <input type="number" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} />

          <label>VJ</label>
          <select value={vj} onChange={(e) => setVj(e.target.value)} required>
            <option value="">Select a VJ...</option>
            {vjOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <label>Video File</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} required />

          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading & converting... this can take a while' : 'Upload'}
          </button>
        </form>
      </main>
    </div>
  );
}