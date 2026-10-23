import React from 'react';

const SeatMap = ({ seats = [], selectedSeats = [], onSeatClick, maxSeats = 8 }) => {
  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsByRow = rows.map((row) => ({
    row,
    seats: seats.filter((s) => s.row === row).sort((a, b) => a.col - b.col),
  }));

  const getSeatClass = (seat) => {
    if (seat.isBooked) return 'seat booked';
    if (selectedSeats.includes(seat.seatNumber)) return 'seat selected';
    return `seat available-${seat.tier}`;
  };

  const handleSeatSelect = (seat) => {
    if (seat.isBooked) return;

    if (!selectedSeats.includes(seat.seatNumber) && selectedSeats.length >= maxSeats) {
      alert(`You can select a maximum of ${maxSeats} seats.`);
      return;
    }

    onSeatClick(seat);
  };

  return (
    <div className="w-100">
      {/* Screen Graphic */}
      <div className="screen-container">
        <div className="cinema-screen">
          <i className="bi bi-display me-2"></i> ALL EYES THIS WAY • SCREEN
        </div>
        <div className="text-secondary small mt-2">
          <i className="bi bi-soundwave text-danger"></i> DOLBY ATMOS 7.1 SURROUND SOUND
        </div>
      </div>

      {/* Seat Rows Matrix */}
      <div className="d-flex flex-column align-items-center overflow-x-auto py-2">
        {seatsByRow.map(({ row, seats: rowSeats }) => (
          <div key={row} className="d-flex align-items-center mb-2">
            <span
              className="fw-bold text-secondary me-3 d-inline-block text-center"
              style={{ width: '20px' }}
            >
              {row}
            </span>

            <div className="d-flex">
              {rowSeats.map((seat, idx) => (
                <React.Fragment key={seat.seatNumber}>
                  {/* Create an aisle gap between col 5 and 6 */}
                  {idx === 5 && <div style={{ width: '28px' }}></div>}
                  <button
                    type="button"
                    className={getSeatClass(seat)}
                    onClick={() => handleSeatSelect(seat)}
                    disabled={seat.isBooked}
                    title={`Seat ${seat.seatNumber} • ${seat.tier.toUpperCase()} • ₹${seat.price}`}
                  >
                    {seat.col}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <span
              className="fw-bold text-secondary ms-3 d-inline-block text-center"
              style={{ width: '20px' }}
            >
              {row}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 mt-4 pt-3 border-top border-secondary border-opacity-25 small text-secondary">
        <div className="d-flex align-items-center gap-2">
          <span className="seat available-standard" style={{ cursor: 'default' }}>1</span>
          <span>Standard (Rows A-B)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat available-premium" style={{ cursor: 'default' }}>1</span>
          <span>Premium (Rows C-E)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat available-vip" style={{ cursor: 'default' }}>1</span>
          <span>VIP Recliner (Row F)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat selected" style={{ cursor: 'default' }}>✓</span>
          <span className="text-white fw-bold">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat booked" style={{ cursor: 'default' }}>✕</span>
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
