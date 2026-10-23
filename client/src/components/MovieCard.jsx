import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="poster-wrapper">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="poster-img"
          loading="lazy"
        />

        <div className="rating-badge">
          <i className="bi bi-star-fill"></i>
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        <div className="poster-overlay">
          <div className="d-flex flex-wrap gap-1 mb-2">
            {movie.genre && movie.genre.slice(0, 2).map((g, idx) => (
              <span key={idx} className="badge bg-danger bg-opacity-75" style={{ fontSize: '0.7rem' }}>
                {g}
              </span>
            ))}
          </div>
          <Link
            to={`/movie/${movie._id}`}
            className="btn btn-cinema btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-ticket-perforated"></i> Book Tickets
          </Link>
        </div>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h5 className="text-white fw-bold mb-0 text-truncate" title={movie.title}>
            {movie.title}
          </h5>
          <span className="badge bg-secondary bg-opacity-50 text-light ms-1" style={{ fontSize: '0.65rem' }}>
            {movie.certificate}
          </span>
        </div>

        <div className="text-secondary small mb-2 d-flex align-items-center gap-2">
          <span>{movie.language}</span>
          <span>•</span>
          <span>{movie.duration}m</span>
        </div>

        <p className="text-secondary small mb-3 flex-grow-1" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4'
        }}>
          {movie.description}
        </p>

        <div className="pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
          <span className="text-secondary small">From <strong className="text-white">₹{movie.basePrice || 220}</strong></span>
          <Link
            to={`/movie/${movie._id}`}
            className="btn btn-link text-danger p-0 text-decoration-none small fw-semibold"
          >
            Showtimes <i className="bi bi-chevron-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
