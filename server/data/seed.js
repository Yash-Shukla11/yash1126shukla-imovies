require('dotenv').config();
const store = require('./store');

async function runSeed() {
  console.log('--- IMovies Database Seeder ---');
  await store.seedDefaults();
  console.log('Seeding complete! You can now log in with:');
  console.log('Admin: admin@imovies.com / admin123');
  console.log('User:  user@imovies.com / user123');
  process.exit(0);
}

runSeed();
