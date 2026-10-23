const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sampleMovies, generateShowtimes, generateSeats } = require('./sampleData');

const DB_FILE = path.join(__dirname, 'db.json');

class DataStore {
  constructor() {
    this.users = [];
    this.movies = [];
    this.showtimes = [];
    this.bookings = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // Check if db.json exists
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || [];
        this.movies = data.movies || [];
        this.showtimes = data.showtimes || [];
        this.bookings = data.bookings || [];
        this.initialized = true;
        console.log(`[DataStore] Loaded ${this.movies.length} movies, ${this.showtimes.length} showtimes, and ${this.users.length} users from cache.`);
        return;
      } catch (err) {
        console.warn('[DataStore] Corrupted db.json, re-seeding default data.');
      }
    }

    await this.seedDefaults();
  }

  async seedDefaults() {
    console.log('[DataStore] Initializing default seed data...');
    
    // Hash default passwords
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
    this.showtimes = generateShowtimes(this.movies);
    this.bookings = [];

    this.saveToFile();
    this.initialized = true;
    console.log(`[DataStore] Successfully seeded: ${this.movies.length} movies, ${this.showtimes.length} showtimes, ${this.users.length} users.`);
  }

  saveToFile() {
    try {
      const data = {
        users: this.users,
        movies: this.movies,
        showtimes: this.showtimes,
        bookings: this.bookings,
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
    if (!includePassword) {
      delete userCopy.password;
    }
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

  // --- Movie Operations ---
  async getMovies(filter = {}) {
    await this.init();
    let result = [...this.movies];

    if (filter.search) {
      const s = filter.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(s) ||
          m.description.toLowerCase().includes(s) ||
          m.director.toLowerCase().includes(s) ||
          m.cast.some((c) => c.toLowerCase().includes(s))
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

    return result;
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

    // Also auto-generate sample showtimes for the new movie
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
    // remove showtimes for this movie
    this.showtimes = this.showtimes.filter((s) => s.movie !== id.toString());
    this.saveToFile();
    return true;
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

    return result;
  }

  async getShowtimeById(id) {
    await this.init();
    const st = this.showtimes.find((s) => s._id === id.toString());
    if (!st) return null;

    // Attach movie details
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

  // --- Booking Operations ---
  async createBooking({ userId, showtimeId, seats, paymentMethod = 'Card' }) {
    await this.init();
    const st = this.showtimes.find((s) => s._id === showtimeId.toString());
    if (!st) throw new Error('Showtime not found');

    const movie = this.movies.find((m) => m._id === st.movie);
    if (!movie) throw new Error('Movie not found');

    // Check if seats are available
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

    // Mark seats as booked in showtime
    st.seats.forEach((s) => {
      if (seats.includes(s.seatNumber)) {
        s.isBooked = true;
        s.bookedBy = userId;
      }
    });
    st.availableSeats = st.seats.filter((s) => !s.isBooked).length;

    const convenienceFee = Math.round(subtotal * 0.05); // 5%
    const tax = Math.round((subtotal + convenienceFee) * 0.18); // 18% GST
    const totalAmount = subtotal + convenienceFee + tax;

    const bookingReference = 'IMOV-' + Math.floor(100000 + Math.random() * 900000);

    const booking = {
      _id: '65f303a3b3c3d3e3f3' + Math.random().toString(16).substring(2, 8),
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
    this.saveToFile();
    return booking;
  }

  async getBookingsByUser(userId) {
    await this.init();
    return this.bookings.filter((b) => b.user === userId.toString());
  }

  async getAllBookings() {
    await this.init();
    return [...this.bookings];
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

    this.saveToFile();
    return booking;
  }

  async getAdminStats() {
    await this.init();
    const totalUsers = this.users.length;
    const totalMovies = this.movies.length;
    const totalShowtimes = this.showtimes.length;
    const totalBookings = this.bookings.length;
    const activeBookings = this.bookings.filter((b) => b.bookingStatus === 'Confirmed');
    const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTicketsSold = activeBookings.reduce((sum, b) => sum + (b.ticketCount || 0), 0);

    return {
      totalUsers,
      totalMovies,
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
