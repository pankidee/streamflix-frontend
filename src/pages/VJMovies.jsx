import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import HeroBanner from '../components/HeroBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { useVJ } from '../context/VJContext';

export default function VJMovies() {
  const { vjName } = useParams();
  const { chooseVj } = useVJ();
  const [movies, setMovies] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chooseVj(vjName);
    setLoading(true);
    const params = { vj: vjName };
    Promise.all([
      api.get('/api/movies', { params }),
      api.get('/api/movies/featured', { params }),
    ])
      .then(([moviesRes, featuredRes]) => {
        setMovies(moviesRes.data);
        setFeatured(featuredRes.data);
      })
      .finally(() => setLoading(false));
  }, [vjName]);

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
        <>
          <HeroBanner movie={featured} />
          <main>
            <h1 className="vj-page-title">{vjName}</h1>
            {movies.length === 0 && <p className="empty-state">No movies yet for {vjName}.</p>}
            {Object.entries(byGenre).map(([genre, list]) => (
              <MovieRow key={genre} title={genre} movies={list} />
            ))}
          </main>
        </>
      )}
      <Footer />
    </div>
  );
}