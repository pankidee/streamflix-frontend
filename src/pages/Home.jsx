import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { useVJ } from '../context/VJContext';

export default function Home() {
  const { selectedVj } = useVJ();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = selectedVj ? { vj: selectedVj } : {};
    api.get('/api/movies', { params })
      .then((res) => setMovies(res.data))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [selectedVj]);

  const byGenre = movies.reduce((acc, movie) => {
    const genre = movie.genre || 'Other';
    acc[genre] = acc[genre] || [];
    acc[genre].push(movie);
    return acc;
  }, {});

  return (
    <div>
      <Navbar />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <main>
          {movies.length === 0 && (
            <p className="empty-state">No movies yet{selectedVj ? ` for ${selectedVj}` : ''}.</p>
          )}
          {Object.entries(byGenre).map(([genre, list]) => (
            <MovieRow key={genre} title={genre} movies={list} />
          ))}
        </main>
      )}
      <Footer />
    </div>
  );
}