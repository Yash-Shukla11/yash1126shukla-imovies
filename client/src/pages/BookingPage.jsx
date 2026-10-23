import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/SeatMap';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [realtimeNotice, setRealtimeNotice] = useState('');

  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.io for real-time seat lock tracking
    socketRef.current = io('/', { transports: ['websocket', 'polling'] });

    socketRef.current.emit('join-showtime', showtimeId);

    socketRef.current.on('seat-held', ({ seatNumber }) => {
      setHeldSeats((prev) => [...prev, seatNumber]);
      setRealtimeNotice(`Seat ${seatNumber} is currently selected by another moviegoer.`);
      setTimeout(() => setRealtimeNotice(''), 4000);
    });

    socketRef.current.on('seat-unheld', ({ seatNumber }) => {
      setHeldSeats((prev) => prev.filter((s) => s !== seatNumber));
    });

    socketRef.current.on('seats-updated', ({ showtimeId: updatedId, bookedSeats, availableSeats }) => {
      if (updatedId === showtimeId) {
        setShowtime((prev) => {
          if (!prev) return prev;
          const newSeats = prev.seats.map((s) =>
            bookedSeats.includes(s.seatNumber) ? { ...s, isBooked: true } : s
          );
          return { ...prev, seats: newSeats, availableSeats };
        });
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [showtimeId]);

  useEffect(() => {
    const fetchShowtime = async () => {
      try {
        const { data } = await api.get(`/showtimes/${showtimeId}`);
        if (data.success) {
          setShowtime(data.data);
        }
      } catch (err) {
        setError('Failed to load showtime details.');
      } finally {
        setLoading(false);
      }
    };

    fetchShowtime();
  }, [showtimeId]);

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNumber));
      if (socketRef.current) {
        socketRef.current.emit('seat-release', { showtimeId, seatNumber: seat.seatNumber });
      }
    } else {
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
      if (socketRef.current) {
        socketRef.current.emit('seat-select', { showtimeId, seatNumber: seat.seatNumber, user: user?.name || 'Guest' });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading interactive seat map..." />;
  }

  if (error || !showtime) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger mb-3">{error || 'Showtime not found'}</h4>
        <Link to="/movies" className="btn btn-cinema">Browse Movies</Link>
      </div>
    );
  }

  // Calculate prices
  const selectedSeatObjects = (showtime.seats || []).filter((s) =>
    selectedSeats.includes(s.seatNumber)
  );
  const subtotal = selectedSeatObjects.reduce((acc, s) => acc + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? Math.round(subtotal * 0.05) : 0;
  const tax = selectedSeats.length > 0 ? Math.round((subtotal + convenienceFee) * 0.18) : 0;
  const totalAmount = subtotal + convenienceFee + tax;

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }

    if (!user) {
      sessionStorage.setItem('pending_booking', JSON.stringify({ showtimeId, selectedSeats }));
      navigate('/login', { state: { from: `/book/${showtimeId}` } });
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post('/bookings', {
        showtimeId,
        seats: selectedSeats,
        paymentMethod,
      });

      if (data.success) {
        navigate('/confirmation', { state: { booking: data.data } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Some selected seats may have just been booked.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb & Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <Link to={`/movie/${showtime.movie}`} className="text-secondary small text-decoration-none mb-1 d-inline-block">
            <i className="bi bi-chevron-left"></i> Change Movie / Showtime
          </Link>
          <h2 className="text-white fw-bold brand-font mb-0">
            {showtime.movieDetails?.title || 'Selected Movie'}
          </h2>
          <div className="text-secondary small mt-1">
            <span className="text-danger fw-semibold">{showtime.theater}</span> • {showtime.screen} • {showtime.date} ({showtime.time}) • <span className="badge bg-secondary">{showtime.format}</span>
          </div>
        </div>

        <div className="text-md-end mt-2 mt-md-0 d-flex align-items-center gap-2">
          <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25 px-2 py-1 small">
            <i className="bi bi-broadcast me-1"></i> Live Real-Time Sync
          </span>
          <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 px-3 py-2 fs-6">
            <i className="bi bi-check-circle me-1"></i> {showtime.availableSeats} Seats Available
          </span>
        </div>
      </div>

      {realtimeNotice && (
        <div className="alert alert-warning py-2 small d-flex align-items-center gap-2">
          <i className="bi bi-info-circle-fill"></i> {realtimeNotice}
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left: Interactive Seat Map */}
        <div className="col-lg-8">
          <div className="glass-panel text-center py-4">
            <SeatMap
              seats={showtime.seats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              maxSeats={8}
            />
          </div>
        </div>

        {/* Right: Checkout & Price Summary */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-receipt text-danger"></i>
              Booking Summary
            </h5>

            <div className="mb-3">
              <div className="d-flex justify-content-between text-secondary small mb-1">
                <span>Selected Seats:</span>
                <span className="fw-bold text-white">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </span>
              </div>
              <div className="d-flex justify-content-between text-secondary small">
                <span>Tickets Count:</span>
                <span className="fw-bold text-white">{selectedSeats.length}</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border-top border-bottom border-secondary border-opacity-25 py-3 mb-3">
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Convenience Fee (5%)</span>
                <span className="text-white">₹{convenienceFee}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary small">
                <span>GST (18%)</span>
                <span className="text-white">₹{tax}</span>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold text-light">Grand Total</span>
              <span className="fs-4 fw-extrabold text-danger brand-font">₹{totalAmount}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-4">
              <label className="text-secondary small fw-semibold mb-2 d-block">
                Select Payment Mode:
              </label>
              <div className="d-flex flex-column gap-2">
                {['Card', 'UPI', 'NetBanking', 'Wallet'].map((method) => (
                  <label
                    key={method}
                    className={`p-2 px-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                      paymentMethod === method
                        ? 'border-danger bg-danger bg-opacity-10 text-white'
                        : 'border-secondary border-opacity-25 text-secondary'
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="form-check-input mt-0"
                      />
                      <span className="small fw-semibold">{method === 'Card' ? 'Credit / Debit Card' : method}</span>
                    </div>
                    <i className={`bi ${method === 'Card' ? 'bi-credit-card' : method === 'UPI' ? 'bi-phone' : method === 'Wallet' ? 'bi-wallet2' : 'bi-bank'}`}></i>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="btn btn-cinema w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={selectedSeats.length === 0 || submitting}
              onClick={handleCheckout}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Processing Reservation...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check"></i>
                  {user ? `Pay ₹${totalAmount} & Book` : 'Sign In & Reserve'}
                </>
              )}
            </button>

            {!user && (
              <p className="text-secondary small text-center mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
                You will be prompted to login to secure your ticket.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
