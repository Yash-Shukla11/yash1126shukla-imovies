const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const notifs = await store.getNotifications(req.user._id);
    res.status(200).json({ success: true, count: notifs.length, data: notifs });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/read', async (req, res, next) => {
  try {
    const updated = await store.markNotificationRead(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
