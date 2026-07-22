import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import VideoPlayer from '../components/VideoPlayer';

export default function WatchEpisode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [streamUrl, setStreamUrl] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/series/episodes/${id}/stream`)
      .then((res) => setStreamUrl(res.data.streamUrl))
      .catch((err) => setError(err.response?.data?.message || 'Could not load episode'));
  }, [id]);

  return (
    <div className="watch-page">
      <button className="watch-back-btn" onClick={() => navigate(-1)}>← Back</button>
      {error && <p className="error" style={{ padding: '2rem' }}>{error}</p>}
      {!error && !streamUrl && <p style={{ padding: '2rem' }}>Loading...</p>}
      {streamUrl && <VideoPlayer streamUrl={streamUrl} startAt={0} onProgress={() => {}} />}
    </div>
  );
}