import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

export default function SeriesList() {
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get('page')) || 1;
  const [series, setSeries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/api/series', { params: { page, limit: 10 } })
      .then((res) => {
        setSeries(res.data.series);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handlePageChange = (p) => {
    setParams({ page: p });
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <Navbar />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <main>
          <h1 className="search-title">Series</h1>
          {series.length === 0 && <p className="empty-state">No series yet.</p>}
          <div className="search-grid">
            {series.map((s) => (
              <Link key={s.id} to={`/series/${s.id}`} className="movie-card">
                <img
                  src={s.posterUrl || '/poster-placeholder.svg'}
                  alt={s.title}
                  onError={(e) => { e.target.src = '/poster-placeholder.svg'; }}
                />
                <div className="movie-card-info">
                  <p className="movie-title">{s.title}</p>
                  {s.vj && <p className="movie-vj">{s.vj}</p>}
                </div>
              </Link>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </main>
      )}
      <Footer />
    </div>
  );
}