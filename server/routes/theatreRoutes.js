const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const theatres = await store.getTheatres(req.query.city);
    res.status(200).json({ success: true, count: theatres.length, data: theatres });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const theatre = await store.getTheatreById(req.params.id);
    if (!theatre) return res.status(404).json({ success: false, message: 'Theatre not found' });
    res.status(200).json({ success: true, data: theatre });
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, admin, async (req, res, next) => {
  try {
    const theatre = await store.createTheatre(req.body);
    res.status(201).json({ success: true, data: theatre, message: 'Theatre created successfully!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
