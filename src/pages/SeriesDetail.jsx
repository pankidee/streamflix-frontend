import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SeriesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/series/${id}`)
      .then((res) => setSeries(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div><Navbar /><LoadingSpinner /></div>;
  if (!series) return <div><Navbar /><p className="empty-state">Series not found.</p></div>;

  const episodes = (series.Episodes || []).slice().sort((a, b) =>
    a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber
  );

  return (
    <div>
      <Navbar />
      <div className="detail-page">
        <div
          className="detail-hero"
          style={{ backgroundImage: `url(${series.posterUrl || '/poster-placeholder.svg'})` }}
        >
          <div className="detail-overlay">
            <div className="detail-content">
              <h1>{series.title}</h1>
              <div className="detail-meta">
                {series.vj && <span className="hero-vj-badge">{series.vj}</span>}
                {series.genre && <span className="detail-genre">{series.genre}</span>}
              </div>
              <p className="detail-description">{series.description}</p>
            </div>
          </div>
        </div>

        <main>
          <h2 className="vj-page-title">Episodes</h2>
          {episodes.length === 0 && <p className="empty-state">No episodes yet.</p>}
          <div className="episode-list">
            {episodes.map((ep) => (
              <div key={ep.id} className="episode-row">
                <div>
                  <p className="movie-title">S{ep.seasonNumber} E{ep.episodeNumber} — {ep.title}</p>
                  {ep.durationMinutes && <p className="movie-vj">{ep.durationMinutes} min</p>}
                </div>
                <button className="btn-play" onClick={() => navigate(`/watch-episode/${ep.id}`)}>
                  ▶ Play
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}