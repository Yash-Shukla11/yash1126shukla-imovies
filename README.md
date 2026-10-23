# 🎬 IMovies - Movie Ticket Booking Made Simple

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://yash1126shukla-imovies-ykkzyr9fdst7apc2ns2uud.streamlit.app/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JWT](https://img.shields.io/badge/JWT-Secure_Auth-black?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)

> **IMovies** is a seamless full-stack cinema ticket reservation platform designed to elevate the movie-going experience. Users can explore movie catalogs, watch trailers, filter by genre, select showtimes across multiple premium cinema halls (IMAX 3D, Dolby Atmos, 4DX), and reserve seats with real-time availability tracking. It features secure JWT authentication, instant digital e-tickets with verifiable QR codes, self-service cancellation, and a comprehensive Admin Command Center.

---

## 📌 Project Links for Mentor Evaluation

- 🌐 **Live Demo Link (Streamlit Cloud):** [https://yash1126shukla-imovies-ykkzyr9fdst7apc2ns2uud.streamlit.app/](https://yash1126shukla-imovies-ykkzyr9fdst7apc2ns2uud.streamlit.app/)
- 💻 **GitHub Repository:** [https://github.com/Yash-Shukla11/yash1126shukla-imovies](https://github.com/Yash-Shukla11/yash1126shukla-imovies)
- 🖥️ **Local Production Server:** `http://localhost:5000`

---

## 🌟 Key Features

### 👤 User Experience
- **Cinematic Discovery:** High-impact hero carousel featuring spotlight movies, trailers, ratings, genres, and cast details.
- **Advanced Filtering & Search:** Real-time search across titles, directors, and actors with genre and release status filters.
- **Interactive Seat Matrix:**
  - Real-time seat reservation map with curved cinema screen perspective.
  - Multi-tier seat pricing: **Standard**, **Premium**, and **VIP Recliners**.
  - Dynamic pricing calculation with taxes, convenience fees, and 8-seat safety limit.
- **Digital E-Tickets & QR Codes:** Instant booking confirmation with generated scannable QR code for contactless entry.
- **User Dashboard (My Bookings):** View booking history, reprint tickets, and self-service cancellation with automated refund initiation.
- **Secure Authentication:** JWT tokens with bcrypt password hashing and session preservation.

### 🛡️ Admin Command Center
- **Analytics Dashboard:** Live revenue metric cards, total tickets sold, active movies, and registered users.
- **Movie Catalog Management:** Add new movies, set genres, posters, trailers, certificates, and base prices.
- **Showtime Scheduler:** Schedule dates, times, screens, and cinema halls for any movie.
- **Reservation Records:** Real-time audit log of all bookings platform-wide.

---

## 📊 Project Epics & Tasks Breakdown (Curriculum Compliance)

| Epic | Tasks Included | Status |
| :--- | :--- | :---: |
| **Epic 1: Project Setup & System Architecture** | • Task 1: Environment & Full-Stack Monorepo Setup<br>• Task 2: Express Server & Middleware Pipeline<br>• Task 3: Dual-Mode Resilient Database Layer | ✅ Completed |
| **Epic 2: Authentication & Role-Based Access** | • Task 4: User Schema with Bcrypt Password Hashing<br>• Task 5: JWT Token Issuance & Auth Endpoints<br>• Task 6: Token Verification & Admin Middleware<br>• Task 7: React Auth Context & Route Guards | ✅ Completed |
| **Epic 3: Movie Catalog & Discovery** | • Task 8: Movie Data Modeling & Relationships<br>• Task 9: RESTful Catalog APIs & Metadata<br>• Task 10: Filtering, Search, & Carousel UI<br>• Task 11: Movie Details & Trailer Player | ✅ Completed |
| **Epic 4: Theaters & Interactive Seat Layout** | • Task 12: Showtime Model with Seat Matrix<br>• Task 13: Showtime Querying & Seat Status API<br>• Task 14: Interactive React Seat Selection Map | ✅ Completed |
| **Epic 5: Checkout & Booking Management** | • Task 15: Booking Transaction & Reference Generator<br>• Task 16: Reservation & Cancellation Endpoints<br>• Task 17: Multi-Payment Checkout & QR E-Ticket | ✅ Completed |
| **Epic 6: User Dashboard & Admin Management** | • Task 18: User Ticket History & Self-Cancellation<br>• Task 19: Admin Metric Analytics & Documentation | ✅ Completed |

---

## 🔑 Demo Login Credentials

For quick evaluation, sample accounts are pre-seeded:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@imovies.com` | `admin123` | Full access to Admin Portal, Metrics, Movie Management & Showtimes |
| **Standard User** | `user@imovies.com` | `user123` | Movie browsing, seat selection, booking tickets, viewing QR tickets |

*(Tip: The Sign In page has 1-click test fill buttons for instant testing!)*

---

## 🏗️ Technical Architecture

```
imovies/
├── client/                     # Frontend (React 18, Vite, Bootstrap 5)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, MovieCard, SeatMap, TicketModal, etc.
│   │   ├── context/            # AuthContext (JWT State Management)
│   │   ├── pages/              # Home, Movies, Details, Booking, Confirmation, Dashboard
│   │   ├── services/           # Axios API Interceptors
│   │   ├── App.jsx             # React Router configuration
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Cinema dark theme CSS & design tokens
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend API (Express.js, Node.js)
│   ├── config/                 # Database connection (MongoDB / Resilient Store)
│   ├── controllers/            # Auth, Movies, Showtimes, Bookings, Admin controllers
│   ├── data/                   # Initial seeds (Sample movies, showtimes, users)
│   ├── middleware/             # JWT auth & error handler middlewares
│   ├── models/                 # Mongoose schemas (User, Movie, Showtime, Booking)
│   ├── routes/                 # Express API routes
│   ├── server.js               # Express entrypoint & static client server
│   └── package.json
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v16.0 or higher) 👉 [Download](https://nodejs.org/)
- **npm** (v8.0 or higher)
- *(Optional)* **MongoDB** 👉 [Download](https://www.mongodb.com/try/download/community) *(Note: IMovies includes an automatic embedded data store so you can test immediately even without a local MongoDB running!)*

### 2. Installation
Clone the repository and install dependencies for both client and server:

```bash
# Clone the repository
git clone <your-github-repo-url>
cd imovies

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Variables
Create a `.env` file in the `server` directory (or use default `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2026_dev
NODE_ENV=development
```

### 4. Running the Application

#### Option A: Single Unified Production Mode (Recommended)
Build the frontend and run everything from port 5000:
```bash
# In client/ directory:
npm run build

# In server/ directory:
npm start
```
Visit **`http://localhost:5000`** in your browser!

#### Option B: Concurrent Development Mode
Run backend (port 5000) and Vite frontend (port 3000) concurrently:
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```
Visit **`http://localhost:3000`** in your browser!

---

## 📡 API Reference

### 🔐 Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get authenticated user profile *(Requires Token)*

### 🎬 Movies
- `GET /api/movies` — List movies (supports `?search=`, `?genre=`, `?status=`, `?sort=`)
- `GET /api/movies/:id` — Get movie details with scheduled showtimes
- `GET /api/movies/meta/genres` — Get list of available genres
- `POST /api/movies` — Create movie *(Admin only)*
- `PUT /api/movies/:id` — Update movie *(Admin only)*
- `DELETE /api/movies/:id` — Delete movie *(Admin only)*

### 🎟️ Showtimes
- `GET /api/showtimes` — List showtimes by movie, date, or theater
- `GET /api/showtimes/:id` — Get showtime details with live seat availability matrix
- `POST /api/showtimes` — Schedule new showtime *(Admin only)*
- `DELETE /api/showtimes/:id` — Cancel showtime slot *(Admin only)*

### 🛒 Bookings
- `POST /api/bookings` — Reserve seats & generate booking reference *(Requires Token)*
- `GET /api/bookings/my-bookings` — Get all bookings for logged-in user *(Requires Token)*
- `GET /api/bookings/:id` — Get single booking details & QR payload *(Requires Token)*
- `PUT /api/bookings/:id/cancel` — Cancel booking and release seats *(Requires Token)*

### 📈 Admin Analytics
- `GET /api/admin/stats` — Total revenue, ticket sales, user counts *(Admin only)*
- `GET /api/admin/bookings` — Platform-wide booking audit log *(Admin only)*

---

## 🐙 GitHub Setup & Push Guide

To push this codebase to your GitHub account:

1. Create a new repository on [GitHub](https://github.com/new) named `imovies`.
2. Run the following commands in your terminal:

```bash
cd "C:\Users\Yash Shukla\.gemini\antigravity\scratch\imovies"

# Check status and stage all files
git add .

# Commit changes
git commit -m "feat: complete full-stack IMovies movie ticket booking platform"

# Rename branch to main
git branch -M main

# Add your GitHub repository as remote (replace <username> with your GitHub username)
git remote add origin https://github.com/<username>/imovies.git

# Push to your GitHub
git push -u origin main
```

---

## 🚢 Deploying Online (Free Live Demo)

### Deploying to Render:
1. Connect your GitHub repository to [Render](https://render.com/).
2. Create a **Web Service**.
3. Set **Build Command:** `cd client && npm install && npm run build && cd ../server && npm install`
4. Set **Start Command:** `cd server && node server.js`
5. Add Environment Variable: `NODE_ENV=production`, `JWT_SECRET=your_secret`.
6. Once deployed, Render will provide a free live URL (e.g. `https://imovies-demo.onrender.com`) to submit to your mentor!

---

## 👨‍💻 Author

- **Developer:** Yash Shukla
- **Project Topic:** IMovies - Movie ticket booking made simple
- **Specialization:** Full Stack Web Development (MERN Stack)
