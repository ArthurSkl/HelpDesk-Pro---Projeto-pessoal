const pool = require('../config/db');

const BASE_SELECT = `
  SELECT
    t.*,
    s.name AS status_name,
    p.name AS priority_name,
    c.name AS category_name,
    req.name AS requester_name,
    COALESCE(ass.name, 'Não atribuído') AS assignee_name
  FROM tickets t
  LEFT JOIN ticket_statuses s ON s.id = t.status_id
  LEFT JOIN ticket_priorities p ON p.id = t.priority_id
  LEFT JOIN ticket_categories c ON c.id = t.category_id
  LEFT JOIN users req ON req.id = t.requester_id
  LEFT JOIN users ass ON ass.id = t.assignee_id
`;

const Ticket = {
  async findAll() {
    const result = await pool.query(BASE_SELECT + 'ORDER BY t.id DESC');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(BASE_SELECT + 'WHERE t.id = $1', [id]);
    return result.rows[0] || null;
  },

  async create(data) {
    const client = await pool.connect();
    try {
      const {
        title, description, requester_id, assignee_id,
        category_id, status_id, priority_id
      } = data;

      await client.query('BEGIN');

      const insertResult = await client.query(
        `INSERT INTO tickets (title, description, requester_id, assignee_id, category_id, status_id, priority_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [title, description, requester_id, assignee_id || null, category_id, status_id, priority_id]
      );

      const ticket = insertResult.rows[0];
      const generatedCode = `TKT-${String(ticket.id).padStart(3, '0')}`;

      const updateResult = await client.query(
        'UPDATE tickets SET code = $1 WHERE id = $2 RETURNING *',
        [generatedCode, ticket.id]
      );

      await client.query('COMMIT');

      const fullResult = await pool.query(BASE_SELECT + 'WHERE t.id = $1', [ticket.id]);
      return fullResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async update(id, data) {
    const { code, title, description, requester_id, assignee_id, category_id, status_id, priority_id } = data;

    const result = await pool.query(
      `UPDATE tickets
       SET code = $1, title = $2, description = $3, requester_id = $4,
           assignee_id = $5, category_id = $6, status_id = $7, priority_id = $8,
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [code, title, description, requester_id, assignee_id || null, category_id, status_id, priority_id, id]
    );

    if (!result.rows[0]) return null;

    const fullResult = await pool.query(BASE_SELECT + 'WHERE t.id = $1', [id]);
    return fullResult.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  },
};

module.exports = Ticket;
