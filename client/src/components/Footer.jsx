import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-top border-secondary border-opacity-25 bg-black py-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <div className="brand-logo mb-3">
              <i className="bi bi-film text-danger"></i>
              <span>I<span className="text-danger">Movies</span></span>
            </div>
            <p className="text-secondary small mb-3" style={{ lineHeight: '1.7' }}>
              Movie ticket booking made simple. Experience seamless cinema seat reservations with real-time seat tracking, instant confirmations, and high-tech theater screens.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">React 18</span>
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">Node.js</span>
              <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1">Express</span>
              <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2 py-1">MongoDB</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/" className="text-secondary text-decoration-none hover-white">Now Showing</Link></li>
              <li><Link to="/movies" className="text-secondary text-decoration-none hover-white">Browse All</Link></li>
              <li><Link to="/my-bookings" className="text-secondary text-decoration-none hover-white">My Bookings</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none hover-white">Account Login</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Cinema Experience</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><i className="bi bi-badge-4k me-2 text-danger"></i> 4K Laser Projection</li>
              <li><i className="bi bi-soundwave me-2 text-danger"></i> Dolby Atmos Sound</li>
              <li><i className="bi bi-gem me-2 text-danger"></i> VIP Luxury Recliners</li>
              <li><i className="bi bi-qr-code-scan me-2 text-danger"></i> Contactless Paperless Entry</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Demo Accounts</h6>
            <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 small">
              <div className="mb-2">
                <span className="badge bg-warning text-dark me-1">Admin</span>
                <span className="text-light">admin@imovies.com</span>
                <div className="text-secondary font-monospace" style={{ fontSize: '0.75rem' }}>Pass: admin123</div>
              </div>
              <div>
                <span className="badge bg-primary text-light me-1">User</span>
                <span className="text-light">user@imovies.com</span>
                <div className="text-secondary font-monospace" style={{ fontSize: '0.75rem' }}>Pass: user123</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary border-opacity-25 mt-4 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small">
          <div>
            &copy; {new Date().getFullYear()} IMovies Cinema Platform. All rights reserved.
          </div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span>Built with ❤️ by Yash Shukla</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
