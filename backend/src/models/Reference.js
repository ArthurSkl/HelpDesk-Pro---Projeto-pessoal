const pool = require('../config/db');

const Reference = {
  async getStatuses() {
    const result = await pool.query('SELECT * FROM ticket_statuses ORDER BY sort_order, id');
    return result.rows;
  },

  async getPriorities() {
    const result = await pool.query('SELECT * FROM ticket_priorities ORDER BY level DESC, id');
    return result.rows;
  },

  async getCategories() {
    const result = await pool.query('SELECT * FROM ticket_categories ORDER BY name');
    return result.rows;
  },

  async getUsers() {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE is_active = true ORDER BY name');
    return result.rows;
  },
};

module.exports = Reference;
