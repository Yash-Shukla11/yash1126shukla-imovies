import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        if (data.success) {
          setMovie(data.data);
          
          // Extract unique dates from showtimes
          if (data.data.showtimes && data.data.showtimes.length > 0) {
            const dates = [...new Set(data.data.showtimes.map((s) => s.date))].sort();
            setAvailableDates(dates);
            if (dates.length > 0) {
              setSelectedDate(dates[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading movie details & showtimes..." />;
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-white">Movie not found</h3>
        <Link to="/movies" className="btn btn-cinema mt-3">Back to Movies</Link>
      </div>
    );
  }

  // Filter showtimes by selected date
  const dateFilteredShowtimes = (movie.showtimes || []).filter(
    (st) => st.date === selectedDate
  );

  // Group showtimes by theater
  const theatersMap = {};
  dateFilteredShowtimes.forEach((st) => {
    if (!theatersMap[st.theater]) {
      theatersMap[st.theater] = [];
    }
    theatersMap[st.theater].push(st);
  });

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return { day, dayNum, month };
  };

  return (
    <div>
      {/* Movie Hero Banner with Glass Overlay */}
      <div
        style={{
          backgroundImage: `url(${movie.bannerUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          position: 'relative',
        }}
        className="py-5"
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,16,22,0.85) 0%, rgba(15,16,22,0.98) 100%)',
          }}
        ></div>

        <div className="container position-relative py-4" style={{ zIndex: 2 }}>
          <Link to="/movies" className="btn btn-sm btn-outline-secondary mb-4 text-light">
            <i className="bi bi-arrow-left me-1"></i> Back to Catalog
          </Link>

          <div className="row g-4 align-items-center">
            {/* Poster */}
            <div className="col-lg-3 col-md-4 text-center">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-25"
                style={{ maxHeight: '420px', objectFit: 'cover' }}
              />
            </div>

            {/* Details */}
            <div className="col-lg-9 col-md-8">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger text-uppercase px-2 py-1">{movie.status}</span>
                <span className="badge bg-secondary bg-opacity-50">{movie.certificate}</span>
                <span className="text-secondary small">{movie.language}</span>
              </div>

              <h1 className="display-5 fw-extrabold text-white brand-font mb-2">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-warning fw-semibold fs-5 mb-3">"{movie.tagline}"</p>
              )}

              {/* Badges / Metrics */}
              <div className="d-flex flex-wrap align-items-center gap-4 mb-3 py-2 border-top border-bottom border-secondary border-opacity-25 small">
                <div className="d-flex align-items-center gap-2 text-warning fw-bold fs-6">
                  <i className="bi bi-star-fill"></i>
                  <span>{movie.rating.toFixed(1)} / 10</span>
                  <span className="text-secondary fw-normal small">({movie.votes?.toLocaleString()} votes)</span>
                </div>
                <div className="text-light">
                  <i className="bi bi-clock me-1 text-danger"></i>
                  <span>{movie.duration} minutes</span>
                </div>
                <div className="text-light">
                  <i className="bi bi-calendar-event me-1 text-danger"></i>
                  <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '2024'}</span>
                </div>
              </div>

              {/* Genre Pills */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.genre && movie.genre.map((g, idx) => (
                  <span key={idx} className="badge bg-dark border border-secondary px-3 py-2 text-light">
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-light text-opacity-80 mb-4" style={{ lineHeight: '1.7', maxWidth: '800px' }}>
                {movie.description}
              </p>

              {/* Cast & Director */}
              <div className="row g-2 small mb-4 text-secondary">
                {movie.director && (
                  <div className="col-12">
                    <strong className="text-white">Director:</strong> {movie.director}
                  </div>
                )}
                {movie.cast && movie.cast.length > 0 && (
                  <div className="col-12">
                    <strong className="text-white">Cast:</strong> {movie.cast.join(', ')}
                  </div>
                )}
              </div>

              <div className="d-flex gap-3">
                <button
                  type="button"
                  className="btn btn-cinema-outline"
                  onClick={() => setShowTrailer(true)}
                >
                  <i className="bi bi-play-circle me-2"></i> Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title text-white">{movie.title} - Official Preview</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowTrailer(false)}></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1"
                    title={movie.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Showtimes & Booking Section */}
      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="text-white fw-bold brand-font mb-1">Select Showtime & Theater</h2>
            <p className="text-secondary small mb-0">Choose date and preferred timing to reserve your seats</p>
          </div>
        </div>

        {/* Date Tabs */}
        {availableDates.length > 0 ? (
          <div className="d-flex gap-3 overflow-x-auto pb-3 mb-4">
            {availableDates.map((dateStr) => {
              const { day, dayNum, month } = formatDateLabel(dateStr);
              const isSelected = selectedDate === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`btn p-3 rounded-4 text-center border transition-all ${
                    isSelected
                      ? 'btn-danger shadow'
                      : 'btn-dark border-secondary border-opacity-50 text-white'
                  }`}
                  style={{ minWidth: '95px' }}
                >
                  <div className="small text-uppercase opacity-75">{day}</div>
                  <div className="fs-4 fw-bold my-1">{dayNum}</div>
                  <div className="small text-uppercase opacity-75">{month}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel text-center py-4 text-secondary mb-4">
            No upcoming showtimes scheduled yet for this title.
          </div>
        )}

        {/* Theaters List */}
        {Object.keys(theatersMap).length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {Object.entries(theatersMap).map(([theaterName, showtimes]) => (
              <div key={theaterName} className="glass-panel p-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 mb-3 mb-lg-0">
                    <h5 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
                      <i className="bi bi-geo-alt-fill text-danger"></i>
                      {theaterName}
                    </h5>
                    <div className="text-secondary small">
                      <span>{showtimes[0]?.screen}</span> • <span className="text-info">{showtimes[0]?.city}</span>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="d-flex flex-wrap gap-3">
                      {showtimes.map((st) => (
                        <button
                          key={st._id}
                          type="button"
                          className="btn btn-dark border border-secondary border-opacity-50 p-2 px-3 text-start rounded-3 hover-cinema"
                          onClick={() => navigate(`/book/${st._id}`)}
                        >
                          <div className="fw-bold text-success fs-6">{st.time}</div>
                          <div className="text-secondary small d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                            <span className="badge bg-secondary bg-opacity-50">{st.format}</span>
                            <span>{st.availableSeats} seats left</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          availableDates.length > 0 && (
            <div className="glass-panel text-center py-4 text-secondary">
              No shows available on this selected date. Please pick another date above.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
