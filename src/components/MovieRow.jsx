import { useRef } from 'react';
import MovieCard from './MovieCard';

export default function MovieRow({ title, movies }) {
  const scrollRef = useRef(null);

  if (!movies.length) return null;

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="movie-row">
      <h2>{title}</h2>
      <div className="movie-row-container">
        <button className="row-arrow row-arrow-left" onClick={() => scroll('left')} aria-label="Scroll left">
          ‹
        </button>
        <div className="movie-row-scroll" ref={scrollRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <button className="row-arrow row-arrow-right" onClick={() => scroll('right')} aria-label="Scroll right">
          ›
        </button>
      </div>
    </section>
  );
}