import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { useVJ } from '../context/VJContext';

export default function VJMovies() {
  const { vjName } = useParams();
  const { chooseVj } = useVJ();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chooseVj(vjName);
    setLoading(true);
    api.get('/api/movies', { params: { vj: vjName, page, limit: 10 } })
      .then((res) => {
        setMovies(res.data.movies);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [vjName, page]);

  const handlePageChange = (p) => {
    setSearchParams({ page: p });
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <Navbar />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <main>
          <h1 className="vj-page-title">{vjName}</h1>
          {movies.length === 0 && <p className="empty-state">No movies yet for {vjName}.</p>}
          <div className="search-grid">
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </main>
      )}
      <Footer />
    </div>
  );
}