import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import TicketModal from '../components/TicketModal';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    if (booking) {
      // Trigger festive cinema confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e50914', '#ffffff', '#fbbf24', '#3b82f6'],
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [booking]);

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-white mb-3">No recent booking found</h4>
        <Link to="/movies" className="btn btn-cinema">Browse Movies</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <div className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-20 text-success mb-3">
          <i className="bi bi-check-circle-fill display-4"></i>
        </div>
        <h1 className="fw-extrabold text-white brand-font mb-2">Booking Confirmed!</h1>
        <p className="text-secondary">
          Your cinema tickets are successfully booked. A confirmation has been generated below.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-panel p-4 mb-4">
            <TicketModal
              booking={booking}
              onClose={() => navigate('/my-bookings')}
            />
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/my-bookings" className="btn btn-cinema">
              <i className="bi bi-ticket-detailed me-2"></i> View All My Bookings
            </Link>
            <Link to="/movies" className="btn btn-cinema-outline">
              <i className="bi bi-film me-2"></i> Book Another Movie
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
