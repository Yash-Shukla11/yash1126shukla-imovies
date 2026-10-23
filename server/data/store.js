const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sampleMovies, generateShowtimes, generateSeats, sampleTheaters } = require('./sampleData');

const DB_FILE = path.join(__dirname, 'db.json');

class DataStore {
  constructor() {
    this.users = [];
    this.movies = [];
    this.theatres = [];
    this.showtimes = [];
    this.bookings = [];
    this.payments = [];
    this.notifications = [];
    this.initialized = false;
    this.io = null; // Socket.io instance
  }

  setSocketIO(io) {
    this.io = io;
  }

  async init() {
    if (this.initialized) return;

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || [];
        this.movies = data.movies || [];
        this.theatres = data.theatres || [];
        this.showtimes = data.showtimes || [];
        this.bookings = data.bookings || [];
        this.payments = data.payments || [];
        this.notifications = data.notifications || [];
        this.initialized = true;

        if (this.theatres.length === 0) {
          this.seedTheatres();
        }
        return;
      } catch (err) {
        console.warn('[DataStore] Error reading db.json, re-seeding.');
      }
    }

    await this.seedDefaults();
  }

  seedTheatres() {
    this.theatres = sampleTheaters.map((t, idx) => ({
      _id: `65f404a4b4c4d4e4f400000${idx + 1}`,
      name: t.name,
      location: {
        address: `${t.name}, High Street`,
        city: t.city || 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
      },
      screens: t.screens.map((s, sIdx) => ({
        screenNumber: `Screen ${sIdx + 1}`,
        screenType: t.format || '2D',
        totalCapacity: 60,
      })),
      amenities: ['4K Laser Projection', 'Dolby Atmos 7.1', 'Gourmet Food', 'Recliner Loungers', 'Valet Parking'],
      contactNumber: '+91 22 2490 1234',
      createdAt: new Date().toISOString(),
    }));
  }

  async seedDefaults() {
    console.log('[DataStore] Seeding default cinema dataset...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const userPasswordHash = await bcrypt.hash('user123', salt);

    this.users = [
      {
        _id: '65f000a0b0c0d0e0f0000001',
        name: 'Admin User',
        email: 'admin@imovies.com',
        password: adminPasswordHash,
        role: 'admin',
        phone: '+91 9876543210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        createdAt: new Date().toISOString(),
      },
      {
        _id: '65f000a0b0c0d0e0f0000002',
        name: 'Yash Shukla',
        email: 'user@imovies.com',
        password: userPasswordHash,
        role: 'user',
        phone: '+91 9123456780',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        createdAt: new Date().toISOString(),
      },
    ];

    this.movies = [...sampleMovies];
    this.seedTheatres();
    this.showtimes = generateShowtimes(this.movies);
    this.bookings = [];
    this.payments = [];
    this.notifications = [];

    this.saveToFile();
    this.initialized = true;
    console.log(`[DataStore] Seeded: ${this.movies.length} movies, ${this.theatres.length} theatres, ${this.showtimes.length} showtimes.`);
  }

  saveToFile() {
    try {
      const data = {
        users: this.users,
        movies: this.movies,
        theatres: this.theatres,
        showtimes: this.showtimes,
        bookings: this.bookings,
        payments: this.payments,
        notifications: this.notifications,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DataStore] Error saving db.json:', err.message);
    }
  }

  // --- User Operations ---
  async findUserByEmail(email, includePassword = false) {
    await this.init();
    const u = this.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (!u) return null;
    const userCopy = { ...u };
    if (!includePassword) delete userCopy.password;
    return userCopy;
  }

  async findUserById(id) {
    await this.init();
    const u = this.users.find((user) => user._id === id.toString());
    if (!u) return null;
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  }

  async createUser(userData) {
    await this.init();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: '65f000a0b0c0d0e0f0' + Math.random().toString(16).substring(2, 8),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: userData.role || 'user',
      phone: userData.phone || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveToFile();
    const { password, ...created } = newUser;
    return created;
  }

  // --- Movie Operations with Search, Filter & Pagination ---
  async getMovies(filter = {}) {
    await this.init();
    let result = [...this.movies];

    if (filter.search) {
      const s = filter.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(s) ||
          m.description.toLowerCase().includes(s) ||
          (m.director && m.director.toLowerCase().includes(s)) ||
          (m.cast && m.cast.some((c) => c.toLowerCase().includes(s)))
      );
    }

    if (filter.genre && filter.genre !== 'All') {
      result = result.filter((m) =>
        m.genre.some((g) => g.toLowerCase() === filter.genre.toLowerCase())
      );
    }

    if (filter.status && filter.status !== 'All') {
      result = result.filter(
        (m) => m.status.toLowerCase() === filter.status.toLowerCase()
      );
    }

    if (filter.language && filter.language !== 'All') {
      result = result.filter(
        (m) => m.language.toLowerCase() === filter.language.toLowerCase()
      );
    }

    if (filter.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filter.sort === 'duration') {
      result.sort((a, b) => a.duration - b.duration);
    } else if (filter.sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    const total = result.length;
    if (filter.page && filter.limit) {
      const page = parseInt(filter.page, 10) || 1;
      const limit = parseInt(filter.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      result = result.slice(startIndex, startIndex + limit);
      return { total, page, limit, data: result };
    }

    return { total, data: result };
  }

  async getMovieById(id) {
    await this.init();
    return this.movies.find((m) => m._id === id.toString()) || null;
  }

  async createMovie(data) {
    await this.init();
    const newMovie = {
      _id: '65f101a1b1c1d1e1f1' + Math.random().toString(16).substring(2, 8),
      title: data.title,
      tagline: data.tagline || '',
      description: data.description,
      genre: Array.isArray(data.genre) ? data.genre : [data.genre],
      duration: Number(data.duration) || 120,
      releaseDate: data.releaseDate || new Date().toISOString().split('T')[0],
      rating: Number(data.rating) || 8.0,
      votes: Number(data.votes) || 100,
      certificate: data.certificate || 'UA',
      language: data.language || 'English',
      director: data.director || '',
      cast: Array.isArray(data.cast) ? data.cast : (data.cast || '').split(',').map((s) => s.trim()),
      posterUrl: data.posterUrl || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600',
      bannerUrl: data.bannerUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600',
      trailerUrl: data.trailerUrl || 'https://www.youtube.com',
      status: data.status || 'Now Showing',
      basePrice: Number(data.basePrice) || 250,
      featured: Boolean(data.featured),
      createdAt: new Date().toISOString(),
    };

    this.movies.unshift(newMovie);
    const newShowtimes = generateShowtimes([newMovie]);
    this.showtimes.push(...newShowtimes);

    this.saveToFile();
    return newMovie;
  }

  async updateMovie(id, data) {
    await this.init();
    const index = this.movies.findIndex((m) => m._id === id.toString());
    if (index === -1) return null;

    this.movies[index] = {
      ...this.movies[index],
      ...data,
      genre: Array.isArray(data.genre) ? data.genre : this.movies[index].genre,
      cast: Array.isArray(data.cast) ? data.cast : this.movies[index].cast,
    };

    this.saveToFile();
    return this.movies[index];
  }

  async deleteMovie(id) {
    await this.init();
    const index = this.movies.findIndex((m) => m._id === id.toString());
    if (index === -1) return false;

    this.movies.splice(index, 1);
    this.showtimes = this.showtimes.filter((s) => s.movie !== id.toString());
    this.saveToFile();
    return true;
  }

  // --- Theatre Operations ---
  async getTheatres(city = null) {
    await this.init();
    if (city && city !== 'All') {
      return this.theatres.filter((t) => t.location?.city?.toLowerCase() === city.toLowerCase());
    }
    return [...this.theatres];
  }

  async getTheatreById(id) {
    await this.init();
    return this.theatres.find((t) => t._id === id.toString()) || null;
  }

  async createTheatre(data) {
    await this.init();
    const newTheatre = {
      _id: '65f404a4b4c4d4e4f4' + Math.random().toString(16).substring(2, 8),
      name: data.name,
      location: data.location || { city: data.city || 'Mumbai', address: data.address || '' },
      screens: data.screens || [{ screenNumber: 'Screen 1', screenType: '2D', totalCapacity: 60 }],
      amenities: data.amenities || ['Dolby Atmos', 'Recliner Seats'],
      contactNumber: data.contactNumber || '+91 22 2490 1234',
      createdAt: new Date().toISOString(),
    };
    this.theatres.push(newTheatre);
    this.saveToFile();
    return newTheatre;
  }

  // --- Showtime Operations ---
  async getShowtimes(filter = {}) {
    await this.init();
    let result = [...this.showtimes];

    if (filter.movie) {
      result = result.filter((s) => s.movie === filter.movie.toString());
    }
    if (filter.date) {
      result = result.filter((s) => s.date === filter.date);
    }
    if (filter.theater) {
      result = result.filter((s) => s.theater === filter.theater);
    }
    if (filter.city) {
      result = result.filter((s) => s.city?.toLowerCase() === filter.city.toLowerCase());
    }

    return result;
  }

  async getShowtimeById(id) {
    await this.init();
    const st = this.showtimes.find((s) => s._id === id.toString());
    if (!st) return null;
    const movie = this.movies.find((m) => m._id === st.movie);
    return {
      ...st,
      movieDetails: movie || null,
    };
  }

  async createShowtime(data) {
    await this.init();
    const pricing = data.pricing || { standard: 220, premium: 350, vip: 550 };
    const seats = generateSeats(pricing);

    const newShowtime = {
      _id: '65f202a2b2c2d2e2f2' + Math.random().toString(16).substring(2, 8),
      movie: data.movie,
      theater: data.theater,
      screen: data.screen || 'Screen 1',
      city: data.city || 'Mumbai',
      date: data.date,
      time: data.time,
      format: data.format || '2D',
      pricing,
      seats,
      totalSeats: seats.length,
      availableSeats: seats.length,
      createdAt: new Date().toISOString(),
    };

    this.showtimes.push(newShowtime);
    this.saveToFile();
    return newShowtime;
  }

  async deleteShowtime(id) {
    await this.init();
    const index = this.showtimes.findIndex((s) => s._id === id.toString());
    if (index === -1) return false;
    this.showtimes.splice(index, 1);
    this.saveToFile();
    return true;
  }

  // --- Booking, Payment & Notification Operations ---
  async createBooking({ userId, showtimeId, seats, paymentMethod = 'Card' }) {
    await this.init();
    const st = this.showtimes.find((s) => s._id === showtimeId.toString());
    if (!st) throw new Error('Showtime not found');

    const movie = this.movies.find((m) => m._id === st.movie);
    if (!movie) throw new Error('Movie not found');

    const alreadyBooked = [];
    const seatDetails = [];
    let subtotal = 0;

    seats.forEach((seatNum) => {
      const seatObj = st.seats.find((s) => s.seatNumber === seatNum);
      if (!seatObj) {
        throw new Error(`Seat ${seatNum} does not exist`);
      }
      if (seatObj.isBooked) {
        alreadyBooked.push(seatNum);
      } else {
        seatDetails.push({
          seatNumber: seatObj.seatNumber,
          tier: seatObj.tier,
          price: seatObj.price,
        });
        subtotal += seatObj.price;
      }
    });

    if (alreadyBooked.length > 0) {
      throw new Error(`Seats already booked: ${alreadyBooked.join(', ')}`);
    }

    // Mark seats as booked
    st.seats.forEach((s) => {
      if (seats.includes(s.seatNumber)) {
        s.isBooked = true;
        s.bookedBy = userId;
      }
    });
    st.availableSeats = st.seats.filter((s) => !s.isBooked).length;

    const convenienceFee = Math.round(subtotal * 0.05);
    const tax = Math.round((subtotal + convenienceFee) * 0.18);
    const totalAmount = subtotal + convenienceFee + tax;
    const bookingReference = 'IMOV-' + Math.floor(100000 + Math.random() * 900000);
    const bookingId = '65f303a3b3c3d3e3f3' + Math.random().toString(16).substring(2, 8);

    const booking = {
      _id: bookingId,
      bookingReference,
      user: userId,
      movie: st.movie,
      movieDetails: {
        title: movie.title,
        posterUrl: movie.posterUrl,
        certificate: movie.certificate,
        language: movie.language,
        duration: movie.duration,
      },
      showtime: showtimeId,
      showtimeDetails: {
        theater: st.theater,
        screen: st.screen,
        date: st.date,
        time: st.time,
        format: st.format,
      },
      seats,
      seatDetails,
      ticketCount: seats.length,
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
      qrCodeData: JSON.stringify({
        ref: bookingReference,
        movie: movie.title,
        theater: st.theater,
        seats,
        date: st.date,
        time: st.time,
      }),
      bookingDate: new Date().toISOString(),
    };

    this.bookings.unshift(booking);

    // Create Payment Record (Collection 7: Payments)
    const transactionId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const payment = {
      _id: '65f505a5b5c5d5e5f5' + Math.random().toString(16).substring(2, 8),
      booking: bookingId,
      user: userId,
      transactionId,
      paymentMethod,
      amount: totalAmount,
      currency: 'INR',
      paymentStatus: 'Success',
      paidAt: new Date().toISOString(),
    };
    this.payments.unshift(payment);

    // Create Notification Record (Collection 8: Notifications)
    const notification = {
      _id: '65f606a6b6c6d6e6f6' + Math.random().toString(16).substring(2, 8),
      user: userId,
      title: 'Booking Confirmed!',
      message: `Your tickets for ${movie.title} (${seats.join(', ')}) at ${st.theater} are confirmed. Reference: ${bookingReference}`,
      type: 'BookingConfirmation',
      relatedId: bookingReference,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notification);

    this.saveToFile();

    // Broadcast real-time seat update via Socket.io
    if (this.io) {
      this.io.emit('seats-updated', {
        showtimeId,
        bookedSeats: seats,
        availableSeats: st.availableSeats,
      });
    }

    return { ...booking, payment };
  }

  async getBookingsByUser(userId) {
    await this.init();
    return this.bookings.filter((b) => b.user === userId.toString());
  }

  async getAllBookings(filter = {}) {
    await this.init();
    let result = [...this.bookings];
    if (filter.status) {
      result = result.filter((b) => b.bookingStatus === filter.status);
    }
    return result;
  }

  async getBookingById(id) {
    await this.init();
    return this.bookings.find((b) => b._id === id.toString() || b.bookingReference === id) || null;
  }

  async cancelBooking(bookingId, userId, isAdmin = false) {
    await this.init();
    const booking = this.bookings.find((b) => b._id === bookingId.toString());
    if (!booking) throw new Error('Booking not found');

    if (!isAdmin && booking.user !== userId.toString()) {
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.bookingStatus === 'Cancelled') {
      throw new Error('Booking is already cancelled');
    }

    // Release seats
    const st = this.showtimes.find((s) => s._id === booking.showtime);
    if (st) {
      st.seats.forEach((s) => {
        if (booking.seats.includes(s.seatNumber)) {
          s.isBooked = false;
          s.bookedBy = null;
        }
      });
      st.availableSeats = st.seats.filter((s) => !s.isBooked).length;
    }

    booking.bookingStatus = 'Cancelled';
    booking.paymentStatus = 'Refunded';

    // Record Refund Payment
    this.payments.unshift({
      _id: '65f505a5b5c5d5e5f5' + Math.random().toString(16).substring(2, 8),
      booking: booking._id,
      user: booking.user,
      transactionId: 'REF-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      paymentMethod: booking.paymentMethod,
      amount: booking.totalAmount,
      currency: 'INR',
      paymentStatus: 'Refunded',
      paidAt: new Date().toISOString(),
    });

    // Create Cancellation Notification
    this.notifications.unshift({
      _id: '65f606a6b6c6d6e6f6' + Math.random().toString(16).substring(2, 8),
      user: booking.user,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingReference} has been cancelled. Full refund of ₹${booking.totalAmount} will be processed.`,
      type: 'BookingCancellation',
      relatedId: booking.bookingReference,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.saveToFile();

    if (this.io && st) {
      this.io.emit('seats-updated', {
        showtimeId: st._id,
        releasedSeats: booking.seats,
        availableSeats: st.availableSeats,
      });
    }

    return booking;
  }

  async getNotifications(userId) {
    await this.init();
    return this.notifications.filter((n) => n.user === userId.toString());
  }

  async markNotificationRead(id, userId) {
    await this.init();
    const notif = this.notifications.find((n) => n._id === id.toString() && n.user === userId.toString());
    if (notif) {
      notif.isRead = true;
      this.saveToFile();
    }
    return notif;
  }

  async getPayments() {
    await this.init();
    return [...this.payments];
  }

  async getAdminStats() {
    await this.init();
    const totalUsers = this.users.length;
    const totalMovies = this.movies.length;
    const totalTheatres = this.theatres.length;
    const totalShowtimes = this.showtimes.length;
    const totalBookings = this.bookings.length;
    const activeBookings = this.bookings.filter((b) => b.bookingStatus === 'Confirmed');
    const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTicketsSold = activeBookings.reduce((sum, b) => sum + (b.ticketCount || 0), 0);

    return {
      totalUsers,
      totalMovies,
      totalTheatres,
      totalShowtimes,
      totalBookings,
      activeBookingsCount: activeBookings.length,
      totalRevenue,
      totalTicketsSold,
    };
  }
}

const store = new DataStore();
module.exports = store;
