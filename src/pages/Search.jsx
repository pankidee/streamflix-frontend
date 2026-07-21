import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    api.get('/api/movies/search', { params: { q } })
      .then((res) => setResults(res.data))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div>
      <Navbar />
      <main>
        <h1 className="search-title">
          {q ? `Results for "${q}"` : 'Search'}
        </h1>
        {loading && <LoadingSpinner />}
        {!loading && q && results.length === 0 && (
          <p className="empty-state">No movies found for "{q}".</p>
        )}
        <div className="search-grid">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}