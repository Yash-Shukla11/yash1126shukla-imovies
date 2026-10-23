import React from 'react';

const LoadingSpinner = ({ text = 'Loading IMovies...' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5 my-5">
      <div
        className="spinner-border text-danger mb-3"
        role="status"
        style={{ width: '3rem', height: '3rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary small fw-semibold letter-spacing-1">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
