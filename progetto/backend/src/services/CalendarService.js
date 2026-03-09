const db = require('../db');

class CalendarService {
  static async listForUser(userId, userRole) {
    if (userRole === 'ADMIN') {
      const [rows] = await db.query('SELECT * FROM calendars');
      return rows;
    }
    const [rows] = await db.query(
      `SELECT c.* FROM calendars c
       JOIN calendar_users cu ON cu.calendar_id = c.id
       WHERE cu.user_id = ?`,
      [userId]
    );
    return rows;
  }

  static async create({ name, description, type, ownerUserId }) {
    const allowedTypes = ['PERSONAL', 'CUSTOM'];
    const finalType = allowedTypes.includes(type) ? type : 'CUSTOM';

    const [result] = await db.query(
      `INSERT INTO calendars (name, description, type, owner_user_id, is_default_personal)
       VALUES (?, ?, ?, ?, FALSE)`,
      [name, description, finalType, ownerUserId]
    );
    const calendarId = result.insertId;

    await db.query(
      `INSERT INTO calendar_users (calendar_id, user_id, role, can_share)
       VALUES (?, ?, 'OWNER', TRUE)`,
      [calendarId, ownerUserId]
    );

    return { id: calendarId, name, description, type: finalType, owner_user_id: ownerUserId };
  }
}

module.exports = { CalendarService };

