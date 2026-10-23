const path = require('path');
const http = require('http');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectDB } = require('./config/db');
const store = require('./data/store');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io for real-time seat availability tracking
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

store.setSocketIO(io);

// Real-time seat updates WebSocket gateway
io.on('connection', (socket) => {
  socket.on('join-showtime', (showtimeId) => {
    socket.join(`showtime_${showtimeId}`);
  });

  socket.on('seat-select', ({ showtimeId, seatNumber, user }) => {
    socket.to(`showtime_${showtimeId}`).emit('seat-held', { seatNumber, user });
  });

  socket.on('seat-release', ({ showtimeId, seatNumber }) => {
    socket.to(`showtime_${showtimeId}`).emit('seat-unheld', { seatNumber });
  });

  socket.on('disconnect', () => {});
});

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting (Security Compliance - Item 4 & 7)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
});
app.use('/api/auth/', authLimiter);

// Multer File Upload Setup (Environment Setup - Item 1)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `poster-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

app.use('/uploads', express.static(uploadDir));

app.post('/api/upload', upload.single('poster'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, url: fileUrl });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'IMovies MERN API',
    version: '1.2.0',
    collections: ['Users', 'Movies', 'Theatres', 'Shows', 'Seats', 'Bookings', 'Payments', 'Notifications'],
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Payment audit logs for admin
app.get('/api/payments', async (req, res, next) => {
  try {
    const payments = await store.getPayments();
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    next(err);
  }
});

// Serve frontend in production if built
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientDist, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await store.init();

    server.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 IMovies Full-Stack Server running on port ${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🎬 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`⚡ WebSocket / Socket.io: Enabled (Real-time seat locks)`);
      console.log(`🛡️ Rate Limiting: Active (express-rate-limit)`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

module.exports = { app, server };
