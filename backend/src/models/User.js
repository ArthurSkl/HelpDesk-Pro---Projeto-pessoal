const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  async create({ name, email, password, role }) {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, is_active, created_at`,
      [name, email, password_hash, role || 'requester']
    );
    return result.rows[0];
  },
};

module.exports = User;
