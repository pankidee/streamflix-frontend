import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import RelatedMovies from '../components/RelatedMovies';

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [streamData, setStreamData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/movies/${id}/stream`)
      .then((res) => setStreamData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load video'));
  }, [id]);

  const handleProgress = useCallback((seconds) => {
    api.post(`/api/movies/${id}/progress`, { progressSeconds: seconds }).catch(() => {});
  }, [id]);

  return (
    <div className="watch-page">
      <button className="watch-back-btn" onClick={() => navigate(-1)}>← Back</button>
      {error && <p className="error" style={{ padding: '2rem' }}>{error}</p>}
      {!error && !streamData && <p style={{ padding: '2rem' }}>Loading...</p>}
      {streamData && (
        <VideoPlayer
          streamUrl={streamData.streamUrl}
          startAt={streamData.resumeAtSeconds}
          onProgress={handleProgress}
        />
      )}
      {streamData && <RelatedMovies movieId={id} />}
    </div>
  );
}