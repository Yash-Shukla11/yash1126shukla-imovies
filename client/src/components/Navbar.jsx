import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg cinema-navbar sticky-top py-3">
      <div className="container">
        <Link className="brand-logo" to="/">
          <i className="bi bi-film text-danger"></i>
          <span>I<span className="text-danger">Movies</span></span>
          <span className="brand-badge ms-1">CINEMA</span>
        </Link>

        <button
          className="navbar-toggler border-secondary text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2 text-white"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
            <li className="nav-item">
              <Link
                className={`nav-link px-3 ${isActive('/') ? 'text-danger fw-bold' : 'text-light'}`}
                to="/"
              >
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link px-3 ${isActive('/movies') ? 'text-danger fw-bold' : 'text-light'}`}
                to="/movies"
              >
                <i className="bi bi-camera-reels me-1"></i> All Movies
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link
                  className={`nav-link px-3 ${isActive('/my-bookings') ? 'text-danger fw-bold' : 'text-light'}`}
                  to="/my-bookings"
                >
                  <i className="bi bi-ticket-perforated me-1"></i> My Bookings
                </Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link
                  className={`nav-link px-3 ${isActive('/admin') ? 'text-warning fw-bold' : 'text-warning'}`}
                  to="/admin"
                >
                  <i className="bi bi-speedometer2 me-1"></i> Admin Portal
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-dark d-flex align-items-center gap-2 border border-secondary px-3 py-2 rounded-pill dropdown-toggle text-white"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                  />
                  <span className="fw-semibold small">{user.name}</span>
                  {isAdmin && (
                    <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.65rem' }}>
                      ADMIN
                    </span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow border-secondary">
                  <li className="px-3 py-2 border-bottom border-secondary mb-1">
                    <div className="small fw-bold text-white">{user.name}</div>
                    <div className="text-secondary small text-truncate" style={{ maxWidth: '200px' }}>
                      {user.email}
                    </div>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/my-bookings">
                      <i className="bi bi-ticket-detailed me-2 text-danger"></i> My Tickets
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2" to="/admin">
                        <i className="bi bi-shield-lock me-2 text-warning"></i> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger py-2"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-cinema-outline btn-sm px-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-cinema btn-sm px-3">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
