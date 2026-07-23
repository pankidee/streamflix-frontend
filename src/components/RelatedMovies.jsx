import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function RelatedMovies({ movieId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!movieId) return;
    api.get(`/api/movies/${movieId}/related`)
      .then((res) => setRelated(res.data))
      .catch(() => setRelated([]));
  }, [movieId]);

  if (related.length === 0) return null;

  return (
    <div className="related-section">
      <h2 className="related-title">You May Also Like</h2>
      <div className="related-grid">
        {related.map((m) => (
          <Link key={m.id} to={`/movie/${m.id}`} className="related-card">
            <img
              src={m.posterUrl || '/poster-placeholder.svg'}
              alt={m.title}
              onError={(e) => { e.target.src = '/poster-placeholder.svg'; }}
            />
            <p className="related-card-title">{m.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}