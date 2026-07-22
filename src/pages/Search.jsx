import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const PER_PAGE = 10;

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const page = parseInt(params.get('page')) || 1;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    api.get('/api/movies/search', { params: { q } })
      .then((res) => setResults(res.data))
      .finally(() => setLoading(false));
  }, [q]);

  const totalPages = Math.ceil(results.length / PER_PAGE);
  const paginated = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePageChange = (p) => {
    setParams({ q, page: p });
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <Navbar />
      <main>
        <h1 className="search-title">{q ? `Results for "${q}"` : 'Search'}</h1>
        {loading && <LoadingSpinner />}
        {!loading && q && results.length === 0 && (
          <p className="empty-state">No movies found for "{q}".</p>
        )}
        <div className="search-grid">
          {paginated.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </main>
      <Footer />
    </div>
  );
}