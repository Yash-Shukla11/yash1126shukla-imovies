const sampleMovies = [
  {
    _id: '65f101a1b1c1d1e1f1000001',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, leading the Manhattan Project at Los Alamos.',
    genre: ['Biography', 'Drama', 'History'],
    duration: 180,
    releaseDate: '2023-07-21',
    rating: 8.9,
    votes: 720000,
    certificate: 'R',
    language: 'English',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    status: 'Now Showing',
    basePrice: 280,
    featured: true,
  },
  {
    _id: '65f101a1b1c1d1e1f1000002',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    duration: 166,
    releaseDate: '2024-03-01',
    rating: 8.8,
    votes: 510000,
    certificate: 'PG-13',
    language: 'English',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    status: 'Now Showing',
    basePrice: 300,
    featured: true,
  },
  {
    _id: '65f101a1b1c1d1e1f1000003',
    title: 'Interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    duration: 169,
    releaseDate: '2014-11-07',
    rating: 8.7,
    votes: 1950000,
    certificate: 'PG-13',
    language: 'English',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    status: 'Now Showing',
    basePrice: 260,
    featured: true,
  },
  {
    _id: '65f101a1b1c1d1e1f1000004',
    title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'It’s how you wear the mask that matters.',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash, Miles must redefine what it means to be a hero.',
    genre: ['Animation', 'Action', 'Adventure'],
    duration: 140,
    releaseDate: '2023-06-02',
    rating: 8.7,
    votes: 400000,
    certificate: 'PG',
    language: 'English',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    status: 'Now Showing',
    basePrice: 240,
    featured: false,
  },
  {
    _id: '65f101a1b1c1d1e1f1000005',
    title: 'The Dark Knight',
    tagline: 'Why so serious?',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 152,
    releaseDate: '2008-07-18',
    rating: 9.0,
    votes: 2800000,
    certificate: 'UA',
    language: 'English',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Gary Oldman'],
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    status: 'Now Showing',
    basePrice: 250,
    featured: false,
  },
  {
    _id: '65f101a1b1c1d1e1f1000006',
    title: 'Deadpool & Wolverine',
    tagline: 'Everyone deserves a happy ending.',
    description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy in a high-octane multiversal showdown.',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    duration: 128,
    releaseDate: '2024-07-26',
    rating: 8.1,
    votes: 380000,
    certificate: 'R',
    language: 'English',
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
    posterUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    status: 'Coming Soon',
    basePrice: 270,
    featured: false,
  },
];

// Helper to generate realistic seats
function generateSeats(pricing = { standard: 220, premium: 350, vip: 550 }) {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = 10;

  rows.forEach((row, rowIndex) => {
    let tier = 'standard';
    let price = pricing.standard;

    if (rowIndex >= 2 && rowIndex <= 4) {
      tier = 'premium';
      price = pricing.premium;
    } else if (rowIndex === 5) {
      tier = 'vip';
      price = pricing.vip;
    }

    for (let c = 1; c <= cols; c++) {
      // randomly book 15-20% seats for realistic look
      const isBooked = (rowIndex === 1 && (c === 4 || c === 5)) ||
                       (rowIndex === 3 && (c === 5 || c === 6 || c === 7)) ||
                       (rowIndex === 5 && (c === 8 || c === 9));

      seats.push({
        seatNumber: `${row}${c}`,
        row,
        col: c,
        tier,
        price,
        isBooked,
      });
    }
  });

  return seats;
}

const sampleTheaters = [
  { name: 'IMAX Luxe - Downtown', screens: ['Screen 1 (IMAX 3D)', 'Screen 2 (Dolby Atmos)'], format: 'IMAX 3D', city: 'Mumbai' },
  { name: 'PVR Grand - Phoenix Mall', screens: ['Audi 3 (Dolby 7.1)', 'Audi 4 (4DX)'], format: '2D', city: 'Mumbai' },
  { name: 'Cinepolis VIP - Seasons', screens: ['VIP Screen 1 (Laser 4K)'], format: '3D', city: 'Mumbai' },
];

function generateShowtimes(movieList) {
  const showtimes = [];
  const times = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];
  
  // Create dates for today, tomorrow, day after
  const today = new Date();
  const dates = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }

  let showtimeCounter = 1;

  movieList.forEach((movie) => {
    if (movie.status === 'Coming Soon') return;

    sampleTheaters.forEach((theater, tIndex) => {
      dates.forEach((date, dIndex) => {
        // 2 showtimes per theater per day
        const selectedTimes = tIndex % 2 === 0 ? [times[0], times[2]] : [times[1], times[3]];
        
        selectedTimes.forEach((time) => {
          const pricing = {
            standard: movie.basePrice || 220,
            premium: Math.round((movie.basePrice || 220) * 1.5),
            vip: Math.round((movie.basePrice || 220) * 2.2),
          };
          const seats = generateSeats(pricing);
          const totalSeats = seats.length;
          const availableSeats = seats.filter((s) => !s.isBooked).length;

          const hexId = showtimeCounter.toString(16).padStart(6, '0');
          showtimes.push({
            _id: `65f202a2b2c2d2e2f2${hexId}`,
            movie: movie._id,
            theater: theater.name,
            screen: theater.screens[0],
            city: theater.city,
            date,
            time,
            format: theater.format,
            pricing,
            seats,
            totalSeats,
            availableSeats,
          });
          showtimeCounter++;
        });
      });
    });
  });

  return showtimes;
}

module.exports = {
  sampleMovies,
  sampleTheaters,
  generateSeats,
  generateShowtimes,
};
