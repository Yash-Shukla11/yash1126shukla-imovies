import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const TicketModal = ({ booking, onClose, onCancelBooking }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (booking) {
      const qrData = booking.qrCodeData || `IMOV-TICKET-${booking.bookingReference}`;
      QRCode.toDataURL(qrData, { width: 180, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [booking]);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCancelled = booking.bookingStatus === 'Cancelled';

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-dark text-white border border-secondary shadow-lg">
          <div className="modal-header border-secondary border-opacity-25">
            <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
              <i className="bi bi-ticket-perforated-fill text-danger"></i>
              Official Movie Ticket
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="ticket-card p-4">
              <div className="ticket-notch-left"></div>
              <div className="ticket-notch-right"></div>

              <div className="row align-items-center">
                {/* Left ticket details */}
                <div className="col-md-8 pe-md-4 border-end-md border-secondary border-opacity-25 mb-4 mb-md-0">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-danger px-3 py-1">
                      {booking.showtimeDetails?.format || '2D'} CINEMA
                    </span>
                    <span className={`badge ${isCancelled ? 'bg-danger' : 'bg-success'} px-3 py-1`}>
                      {booking.bookingStatus.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="fw-bold text-white mb-1">
                    {booking.movieDetails?.title || 'Movie Title'}
                  </h3>

                  <div className="text-secondary small mb-3">
                    {booking.movieDetails?.certificate} • {booking.movieDetails?.language} • {booking.movieDetails?.duration}m
                  </div>

                  <div className="row g-3 small">
                    <div className="col-6">
                      <span className="text-secondary d-block">Cinema Hall</span>
                      <strong className="text-white">{booking.showtimeDetails?.theater}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Screen</span>
                      <strong className="text-white">{booking.showtimeDetails?.screen}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Date & Time</span>
                      <strong className="text-white">{booking.showtimeDetails?.date} | {booking.showtimeDetails?.time}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Seats ({booking.ticketCount})</span>
                      <strong className="text-warning fs-6">{booking.seats.join(', ')}</strong>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-secondary small d-block">Booking Reference</span>
                      <span className="font-monospace fw-bold text-danger">{booking.bookingReference}</span>
                    </div>
                    <div className="text-end">
                      <span className="text-secondary small d-block">Total Paid</span>
                      <strong className="fs-5 text-white">₹{booking.totalAmount}</strong>
                    </div>
                  </div>
                </div>

                {/* Right QR Code Section */}
                <div className="col-md-4 text-center ps-md-3">
                  <div className="bg-white p-2 rounded-3 d-inline-block shadow-sm mb-2">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="Ticket QR Code" style={{ width: '140px', height: '140px' }} />
                    ) : (
                      <div style={{ width: '140px', height: '140px' }} className="d-flex align-items-center justify-content-center text-dark">
                        <i className="bi bi-qr-code fs-1"></i>
                      </div>
                    )}
                  </div>
                  <div className="text-secondary font-monospace small" style={{ fontSize: '0.75rem' }}>
                    SCAN AT THEATER TURNSTILE
                  </div>
                  <div className="text-muted small mt-1">
                    Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-secondary border-opacity-25 d-flex justify-content-between">
            <div>
              {!isCancelled && onCancelBooking && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onCancelBooking(booking._id)}
                >
                  <i className="bi bi-x-circle me-1"></i> Cancel Booking
                </button>
              )}
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-cinema-outline btn-sm"
                onClick={handlePrint}
              >
                <i className="bi bi-printer me-1"></i> Print Ticket
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
