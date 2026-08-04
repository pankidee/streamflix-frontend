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
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/movies/vjs').then((res) => setVjOptions(res.data));
  }, []);

  const uploadDirectToR2 = (uploadUrl, file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error('Direct upload to storage failed'));
      };
      xhr.onerror = () => reject(new Error('Network error during upload'));

      xhr.send(file);
    });
  };

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

    setUploading(true);
    setProgress(0);

    try {
      setStatusMsg('Preparing upload...');
      const { data } = await api.post('/api/movies/upload-url', {
        filename: videoFile.name,
        contentType: videoFile.type,
      });

      setStatusMsg('Uploading video file...');
      await uploadDirectToR2(data.uploadUrl, videoFile);

      setStatusMsg('Converting & finalizing... this can take a while');
      setProgress(100);

      await api.post('/api/movies/process', {
        key: data.key,
        title, description, posterUrl, genre, releaseYear, vj,
      });

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
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

          {uploading && (
            <div style={{ margin: '1rem 0' }}>
              <div style={{ background: '#333', borderRadius: '6px', overflow: 'hidden', height: '10px' }}>
                <div style={{
                  width: `${progress}%`, background: '#e50914', height: '100%',
                  transition: 'width 0.2s',
                }} />
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{statusMsg} {progress < 100 ? `(${progress}%)` : ''}</p>
            </div>
          )}

          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </main>
    </div>
  );
}