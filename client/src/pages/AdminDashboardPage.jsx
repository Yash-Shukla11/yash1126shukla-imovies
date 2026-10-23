import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('movies');
  const [notification, setNotification] = useState('');

  // Add Movie Form state
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [movieForm, setMovieForm] = useState({
    title: '',
    tagline: '',
    description: '',
    genre: 'Action, Thriller',
    duration: 130,
    rating: 8.5,
    certificate: 'UA',
    language: 'English',
    director: '',
    cast: '',
    posterUrl: '',
    bannerUrl: '',
    basePrice: 250,
    status: 'Now Showing',
  });

  // Add Theatre Form state
  const [showAddTheatreModal, setShowAddTheatreModal] = useState(false);
  const [theatreForm, setTheatreForm] = useState({
    name: '',
    city: 'Mumbai',
    address: '',
    contactNumber: '+91 22 2490 1234',
  });

  // Add Showtime Form state
  const [showAddShowtimeModal, setShowAddShowtimeModal] = useState(false);
  const [showtimeForm, setShowtimeForm] = useState({
    movie: '',
    theater: 'IMAX Luxe - Downtown',
    screen: 'Screen 1 (IMAX 3D)',
    date: new Date().toISOString().split('T')[0],
    time: '07:00 PM',
    format: 'IMAX 3D',
  });

  const fetchData = async () => {
    try {
      const [statsRes, moviesRes, theatresRes, showtimesRes, bookingsRes, paymentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies'),
        api.get('/theatres'),
        api.get('/showtimes'),
        api.get('/admin/bookings'),
        api.get('/payments'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (moviesRes.data.success) setMovies(moviesRes.data.data);
      if (theatresRes.data.success) setTheatres(theatresRes.data.data);
      if (showtimesRes.data.success) setShowtimes(showtimesRes.data.data);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movieForm,
        genre: movieForm.genre.split(',').map((s) => s.trim()),
        cast: movieForm.cast.split(',').map((s) => s.trim()),
      };
      const { data } = await api.post('/movies', payload);
      if (data.success) {
        setNotification('Movie successfully added to catalog!');
        setShowAddMovieModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add movie');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie? Associated showtimes will also be removed.')) {
      return;
    }
    try {
      const { data } = await api.delete(`/movies/${id}`);
      if (data.success) {
        setNotification('Movie deleted.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete movie');
    }
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/theatres', theatreForm);
      if (data.success) {
        setNotification('Cinema Theatre registered successfully!');
        setShowAddTheatreModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add theatre');
    }
  };

  const handleCreateShowtime = async (e) => {
    e.preventDefault();
    if (!showtimeForm.movie) {
      alert('Please select a movie');
      return;
    }
    try {
      const { data } = await api.post('/showtimes', showtimeForm);
      if (data.success) {
        setNotification('Showtime created successfully!');
        setShowAddShowtimeModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add showtime');
    }
  };

  const handleDeleteShowtime = async (id) => {
    if (!window.confirm('Delete this showtime slot?')) return;
    try {
      const { data } = await api.delete(`/showtimes/${id}`);
      if (data.success) {
        setNotification('Showtime removed.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete showtime');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin analytics & controls..." />;
  }

  return (
    <div className="container py-4">
      {/* Admin Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-warning text-dark px-2 py-1 mb-1">PLATFORM ADMIN</span>
          <h1 className="fw-bold text-white brand-font mb-0">IMovies Command Center</h1>
          <p className="text-secondary small mb-0">System metrics, movie catalog, theatres, and financial audit logs</p>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
          <button
            type="button"
            className="btn btn-cinema btn-sm"
            onClick={() => setShowAddMovieModal(true)}
          >
            <i className="bi bi-plus-circle me-1"></i> Add Movie
          </button>
          <button
            type="button"
            className="btn btn-outline-info btn-sm"
            onClick={() => setShowAddTheatreModal(true)}
          >
            <i className="bi bi-building-add me-1"></i> Add Theatre
          </button>
          <button
            type="button"
            className="btn btn-cinema-outline btn-sm"
            onClick={() => setShowAddShowtimeModal(true)}
          >
            <i className="bi bi-calendar-plus me-1"></i> Add Showtime
          </button>
        </div>
      </div>

      {notification && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {notification}
          <button type="button" className="btn-close" onClick={() => setNotification('')}></button>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="glass-panel p-3">
            <div className="text-secondary small mb-1">Total Revenue</div>
            <h3 className="fw-extrabold text-success brand-font mb-0">₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
            <div className="text-muted small mt-1">{payments.length} processed payments</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="glass-panel p-3">
            <div className="text-secondary small mb-1">Tickets Sold</div>
            <h3 className="fw-extrabold text-warning brand-font mb-0">{stats?.totalTicketsSold || 0}</h3>
            <div className="text-muted small mt-1">{stats?.activeBookingsCount || 0} active reservations</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="glass-panel p-3">
            <div className="text-secondary small mb-1">Cinema Theatres</div>
            <h3 className="fw-extrabold text-primary brand-font mb-0">{theatres.length}</h3>
            <div className="text-muted small mt-1">{showtimes.length} live showtimes</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="glass-panel p-3">
            <div className="text-secondary small mb-1">Registered Users</div>
            <h3 className="fw-extrabold text-info brand-font mb-0">{stats?.totalUsers || 0}</h3>
            <div className="text-muted small mt-1">Platform customer accounts</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills gap-2 mb-4 p-2 bg-dark rounded-4 border border-secondary border-opacity-25">
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-3 ${activeTab === 'movies' ? 'active bg-danger' : 'text-secondary'}`}
            onClick={() => setActiveTab('movies')}
          >
            <i className="bi bi-camera-reels me-1"></i> Movies ({movies.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-3 ${activeTab === 'theatres' ? 'active bg-danger' : 'text-secondary'}`}
            onClick={() => setActiveTab('theatres')}
          >
            <i className="bi bi-building me-1"></i> Theatres ({theatres.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-3 ${activeTab === 'showtimes' ? 'active bg-danger' : 'text-secondary'}`}
            onClick={() => setActiveTab('showtimes')}
          >
            <i className="bi bi-calendar-event me-1"></i> Showtimes ({showtimes.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-3 ${activeTab === 'bookings' ? 'active bg-danger' : 'text-secondary'}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-receipt me-1"></i> Bookings ({bookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-3 ${activeTab === 'payments' ? 'active bg-danger' : 'text-secondary'}`}
            onClick={() => setActiveTab('payments')}
          >
            <i className="bi bi-credit-card me-1"></i> Payments ({payments.length})
          </button>
        </li>
      </ul>

      {/* TAB 1: MOVIES */}
      {activeTab === 'movies' && (
        <div className="glass-panel p-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th>Base Price</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id} className="border-secondary border-opacity-25">
                    <td style={{ width: '60px' }}>
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="rounded-2"
                        style={{ width: '45px', height: '65px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-white">{m.title}</div>
                      <div className="text-secondary small">{m.director || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="small text-secondary">{m.genre?.join(', ')}</div>
                    </td>
                    <td>{m.duration}m</td>
                    <td>
                      <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-25">
                        ⭐ {m.rating}
                      </span>
                    </td>
                    <td>₹{m.basePrice || 220}</td>
                    <td>
                      <span className={`badge ${m.status === 'Now Showing' ? 'bg-success' : 'bg-info'} bg-opacity-25 text-light`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteMovie(m._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: THEATRES */}
      {activeTab === 'theatres' && (
        <div className="glass-panel p-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>Theatre Name</th>
                  <th>City / Location</th>
                  <th>Screens</th>
                  <th>Amenities</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {theatres.map((t) => (
                  <tr key={t._id} className="border-secondary border-opacity-25">
                    <td className="fw-bold text-white">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      {t.name}
                    </td>
                    <td>
                      <span className="badge bg-info bg-opacity-25 text-info">{t.location?.city || 'Mumbai'}</span>
                      <div className="text-secondary small">{t.location?.address}</div>
                    </td>
                    <td>{t.screens?.length || 1} Screens</td>
                    <td>
                      <div className="small text-secondary">{t.amenities?.slice(0, 3).join(', ')}</div>
                    </td>
                    <td className="small text-secondary">{t.contactNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SHOWTIMES */}
      {activeTab === 'showtimes' && (
        <div className="glass-panel p-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>Theatre</th>
                  <th>Screen & Format</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Available Seats</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {showtimes.map((st) => (
                  <tr key={st._id} className="border-secondary border-opacity-25">
                    <td className="fw-bold text-white">{st.theater}</td>
                    <td>
                      <div>{st.screen}</div>
                      <span className="badge bg-secondary small">{st.format}</span>
                    </td>
                    <td>{st.date}</td>
                    <td className="text-success fw-bold">{st.time}</td>
                    <td>
                      <span className="badge bg-success bg-opacity-20 text-success">
                        {st.availableSeats} / {st.totalSeats} seats
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteShowtime(st._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ALL BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="glass-panel p-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>Ref ID</th>
                  <th>Movie</th>
                  <th>Theatre & Time</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-secondary border-opacity-25">
                    <td className="font-monospace text-danger fw-bold">{b.bookingReference}</td>
                    <td className="fw-semibold text-white">{b.movieDetails?.title}</td>
                    <td>
                      <div className="small">{b.showtimeDetails?.theater}</div>
                      <div className="text-secondary small">{b.showtimeDetails?.date} at {b.showtimeDetails?.time}</div>
                    </td>
                    <td className="text-warning fw-bold">{b.seats.join(', ')}</td>
                    <td className="text-white fw-bold">₹{b.totalAmount}</td>
                    <td className="text-secondary small">{new Date(b.bookingDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${b.bookingStatus === 'Confirmed' ? 'bg-success' : 'bg-danger'}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-secondary">
                      No customer bookings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENTS AUDIT */}
      {activeTab === 'payments' && (
        <div className="glass-panel p-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>Txn ID</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid At</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-secondary border-opacity-25">
                    <td className="font-monospace text-info fw-bold">{p.transactionId}</td>
                    <td>{p.paymentMethod}</td>
                    <td className="text-white fw-bold">₹{p.amount}</td>
                    <td>
                      <span className={`badge ${p.paymentStatus === 'Success' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="text-secondary small">{new Date(p.paidAt).toLocaleString()}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-secondary">
                      No payment transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Movie */}
      {showAddMovieModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold">Add New Movie to IMovies</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddMovieModal(false)}></button>
              </div>
              <form onSubmit={handleCreateMovie}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small text-secondary">Movie Title *</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        value={movieForm.title}
                        onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Certificate</label>
                      <select
                        className="form-select bg-dark text-white border-secondary"
                        value={movieForm.certificate}
                        onChange={(e) => setMovieForm({ ...movieForm, certificate: e.target.value })}
                      >
                        <option value="U">U (Universal)</option>
                        <option value="UA">UA (Parental Guidance)</option>
                        <option value="A">A (Adults Only)</option>
                        <option value="PG-13">PG-13</option>
                        <option value="R">R</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small text-secondary">Tagline</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        value={movieForm.tagline}
                        onChange={(e) => setMovieForm({ ...movieForm, tagline: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small text-secondary">Synopsis / Description *</label>
                      <textarea
                        className="form-control bg-dark text-white border-secondary"
                        rows="3"
                        value={movieForm.description}
                        onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Genres (comma separated) *</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        value={movieForm.genre}
                        onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small text-secondary">Duration (mins) *</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-white border-secondary"
                        value={movieForm.duration}
                        onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small text-secondary">Base Price (₹) *</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-white border-secondary"
                        value={movieForm.basePrice}
                        onChange={(e) => setMovieForm({ ...movieForm, basePrice: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Poster URL (Image link) *</label>
                      <input
                        type="url"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="https://..."
                        value={movieForm.posterUrl}
                        onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Banner / Backdrop URL</label>
                      <input
                        type="url"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="https://..."
                        value={movieForm.bannerUrl}
                        onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary border-opacity-25">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddMovieModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cinema">
                    Save & Publish Movie
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Theatre */}
      {showAddTheatreModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold">Register Cinema Theatre</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddTheatreModal(false)}></button>
              </div>
              <form onSubmit={handleCreateTheatre}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Theatre Name *</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. INOX Megaplex"
                      value={theatreForm.name}
                      onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-secondary">City *</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Mumbai, Delhi, Bangalore"
                      value={theatreForm.city}
                      onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Address</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Mall / Street address"
                      value={theatreForm.address}
                      onChange={(e) => setTheatreForm({ ...theatreForm, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddTheatreModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-cinema">Register Theatre</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Showtime */}
      {showAddShowtimeModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold">Schedule New Showtime</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddShowtimeModal(false)}></button>
              </div>
              <form onSubmit={handleCreateShowtime}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Select Movie *</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={showtimeForm.movie}
                      onChange={(e) => setShowtimeForm({ ...showtimeForm, movie: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Movie --</option>
                      {movies.map((m) => (
                        <option key={m._id} value={m._id}>{m.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary">Theatre *</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={showtimeForm.theater}
                      onChange={(e) => setShowtimeForm({ ...showtimeForm, theater: e.target.value })}
                      required
                    >
                      {theatres.map((t) => (
                        <option key={t._id} value={t.name}>{t.name} ({t.location?.city})</option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-secondary">Date *</label>
                      <input
                        type="date"
                        className="form-control bg-dark text-white border-secondary"
                        value={showtimeForm.date}
                        onChange={(e) => setShowtimeForm({ ...showtimeForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary">Time Slot *</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="07:00 PM"
                        value={showtimeForm.time}
                        onChange={(e) => setShowtimeForm({ ...showtimeForm, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary">Screen Format</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={showtimeForm.format}
                      onChange={(e) => setShowtimeForm({ ...showtimeForm, format: e.target.value })}
                    >
                      <option value="2D">2D</option>
                      <option value="3D">3D</option>
                      <option value="IMAX 3D">IMAX 3D</option>
                      <option value="4DX">4DX</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer border-secondary border-opacity-25">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddShowtimeModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cinema">
                    Add Showtime Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
