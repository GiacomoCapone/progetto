const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { CalendarService } = require('../services/CalendarService');

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const calendars = await CalendarService.listForUser(req.user.id, req.user.role);
    res.json(calendars);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, type } = req.body;
    const calendar = await CalendarService.create({
      name,
      description,
      type,
      ownerUserId: req.user.id
    });
    res.status(201).json(calendar);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

