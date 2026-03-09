const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, birthday } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const [userRes] = await db.query(
      `INSERT INTO users (email, password_hash, name, birthday)
       VALUES (?, ?, ?, ?)`,
      [email, hashed, name, birthday || null]
    );
    const userId = userRes.insertId;

    const [calRes] = await db.query(
      `INSERT INTO calendars (name, type, owner_user_id, is_default_personal)
       VALUES (?, 'PERSONAL', ?, TRUE)`,
      [`Calendario di ${name || email}`, userId]
    );
    const personalCalendarId = calRes.insertId;

    await db.query(
      `INSERT INTO calendar_users (calendar_id, user_id, role, can_share)
       VALUES (?, ?, 'OWNER', TRUE)`,
      [personalCalendarId, userId]
    );

    const token = jwt.sign({ sub: userId, role: 'USER' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({ accessToken: token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ accessToken: token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

