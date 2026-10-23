import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Now Showing');
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await api.get('/movies');
        if (data.success) {
          setMovies(data.data);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const featuredMovie = movies.find((m) => m.featured) || movies[0];
  const filteredMovies = movies.filter((m) => m.status === activeTab);

  if (loading) {
    return <LoadingSpinner text="Fetching the latest cinema blockbusters..." />;
  }

  return (
    <div className="container py-4">
      {/* Hero Blockbuster Banner */}
      {featuredMovie && (
        <div
          className="hero-banner"
          style={{ backgroundImage: `url(${featuredMovie.bannerUrl || featuredMovie.posterUrl})` }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="badge bg-danger text-uppercase px-3 py-1 mb-2">Featured Spotlight</span>
            <h1 className="display-4 fw-extrabold text-white mb-2 brand-font">
              {featuredMovie.title}
            </h1>
            <p className="text-warning fw-semibold mb-2 fs-5">
              "{featuredMovie.tagline || 'Experience the cinema phenomenon'}"
            </p>
            <div className="d-flex align-items-center gap-3 text-secondary mb-3 small">
              <span className="text-warning fw-bold d-flex align-items-center gap-1">
                <i className="bi bi-star-fill"></i> {featuredMovie.rating.toFixed(1)}/10
              </span>
              <span>•</span>
              <span>{featuredMovie.duration} mins</span>
              <span>•</span>
              <span className="badge bg-secondary bg-opacity-50">{featuredMovie.certificate}</span>
              <span>•</span>
              <span>{featuredMovie.genre.join(', ')}</span>
            </div>
            <p className="text-light text-opacity-75 mb-4" style={{ lineHeight: '1.6' }}>
              {featuredMovie.description}
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to={`/movie/${featuredMovie._id}`} className="btn btn-cinema btn-lg px-4">
                <i className="bi bi-ticket-perforated-fill me-2"></i> Book Tickets Now
              </Link>
              <button
                type="button"
                className="btn btn-cinema-outline btn-lg px-4"
                onClick={() => setShowTrailerModal(true)}
              >
                <i className="bi bi-play-circle me-2"></i> Watch Trailer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailerModal && featuredMovie && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title text-white">{featuredMovie.title} - Official Trailer</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowTrailerModal(false)}></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1"
                    title={featuredMovie.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs & Section Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="text-white fw-bold mb-1 brand-font">Explore Movies</h2>
          <p className="text-secondary small mb-0">Select your preferred movie to view showtimes and book seats</p>
        </div>

        <div className="d-flex gap-2 p-1 bg-dark rounded-pill border border-secondary border-opacity-25">
          <button
            className={`btn btn-sm rounded-pill px-4 ${activeTab === 'Now Showing' ? 'btn-danger' : 'btn-dark text-secondary'}`}
            onClick={() => setActiveTab('Now Showing')}
          >
            Now Showing
          </button>
          <button
            className={`btn btn-sm rounded-pill px-4 ${activeTab === 'Coming Soon' ? 'btn-danger' : 'btn-dark text-secondary'}`}
            onClick={() => setActiveTab('Coming Soon')}
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="row g-4 mb-5">
        {filteredMovies.map((movie) => (
          <div key={movie._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Cinema Features / Value Proposition */}
      <div className="glass-panel mt-5">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-white brand-font">The Ultimate Cinema Experience</h3>
          <p className="text-secondary small">Why millions trust IMovies for their premium entertainment reservations</p>
        </div>
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="p-3">
              <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-3 fs-2">
                <i className="bi bi-display"></i>
              </div>
              <h5 className="text-white fw-bold mb-2">IMAX Laser & 3D</h5>
              <p className="text-secondary small">
                Crystal clear 4K laser projection with intense contrast and hyper-realistic depth.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-3 fs-2">
                <i className="bi bi-cursor-fill"></i>
              </div>
              <h5 className="text-white fw-bold mb-2">Live Interactive Seat Map</h5>
              <p className="text-secondary small">
                Choose your exact favorite recliner with real-time seat availability tracking.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-3 fs-2">
                <i className="bi bi-qr-code-scan"></i>
              </div>
              <h5 className="text-white fw-bold mb-2">Instant Digital E-Tickets</h5>
              <p className="text-secondary small">
                Scan your QR code at turnstiles for fast, contactless, paperless entry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
