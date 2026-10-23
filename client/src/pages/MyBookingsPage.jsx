import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TicketModal from '../components/TicketModal';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notification, setNotification] = useState('');

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Full refund will be initiated.')) {
      return;
    }

    try {
      const { data } = await api.put(`/bookings/${bookingId}/cancel`);
      if (data.success) {
        setNotification('Booking successfully cancelled. Refund has been credited.');
        setSelectedBooking(null);
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving your cinema tickets..." />;
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-white brand-font mb-1">My Movie Tickets</h1>
          <p className="text-secondary small mb-0">View your active reservations, digital QR tickets, and booking history</p>
        </div>
        <Link to="/movies" className="btn btn-cinema btn-sm">
          <i className="bi bi-plus-lg me-1"></i> Book New Ticket
        </Link>
      </div>

      {notification && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {notification}
          <button type="button" className="btn-close" onClick={() => setNotification('')}></button>
        </div>
      )}

      {bookings.length > 0 ? (
        <div className="row g-4">
          {bookings.map((b) => {
            const isCancelled = b.bookingStatus === 'Cancelled';
            return (
              <div key={b._id} className="col-lg-6">
                <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="badge bg-secondary bg-opacity-50 small mb-1">
                          Ref: {b.bookingReference}
                        </span>
                        <h4 className="fw-bold text-white mb-0">
                          {b.movieDetails?.title || 'Movie'}
                        </h4>
                      </div>
                      <span className={`badge ${isCancelled ? 'bg-danger' : 'bg-success'} px-3 py-1`}>
                        {b.bookingStatus}
                      </span>
                    </div>

                    <div className="text-secondary small mb-3">
                      <div><strong className="text-light">{b.showtimeDetails?.theater}</strong> • {b.showtimeDetails?.screen}</div>
                      <div>{b.showtimeDetails?.date} at <strong className="text-light">{b.showtimeDetails?.time}</strong></div>
                    </div>

                    <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 mb-3">
                      <div className="d-flex justify-content-between small text-secondary mb-1">
                        <span>Reserved Seats:</span>
                        <strong className="text-warning">{b.seats.join(', ')}</strong>
                      </div>
                      <div className="d-flex justify-content-between small text-secondary">
                        <span>Total Paid:</span>
                        <strong className="text-white">₹{b.totalAmount} ({b.ticketCount} tickets)</strong>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 pt-2 border-top border-secondary border-opacity-25">
                    <button
                      type="button"
                      className="btn btn-cinema btn-sm flex-grow-1"
                      onClick={() => setSelectedBooking(b)}
                    >
                      <i className="bi bi-qr-code me-1"></i> View Ticket & QR
                    </button>
                    {!isCancelled && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleCancelBooking(b._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 glass-panel">
          <i className="bi bi-ticket-perforated text-secondary display-3 mb-3 d-block"></i>
          <h4 className="text-white fw-bold">No tickets found</h4>
          <p className="text-secondary small">You haven't made any movie reservations yet.</p>
          <Link to="/movies" className="btn btn-cinema btn-sm mt-2">
            Explore Now Showing Movies
          </Link>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedBooking && (
        <TicketModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancelBooking={handleCancelBooking}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;
