require('dotenv').config();
const express = require('express');
const pool = require('./config/db');

const app = express();

app.use(express.json());

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      ok: true,
      now: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Erro ao conectar com o banco',
    });
  }
});

app.get('/tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Erro ao buscar tickets',
    });
  }
});

app.post('/tickets', async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      title,
      description,
      requester_id,
      assignee_id,
      category_id,
      status_id,
      priority_id
    } = req.body;

    if (!title || !description || !requester_id || !category_id || !status_id || !priority_id) {
      return res.status(400).json({
        ok: false,
        message: 'Preencha os campos obrigatórios',
      });
    }

    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO tickets (
        title,
        description,
        requester_id,
        assignee_id,
        category_id,
        status_id,
        priority_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const insertValues = [
      title,
      description,
      requester_id,
      assignee_id || null,
      category_id,
      status_id,
      priority_id
    ];

    const insertResult = await client.query(insertQuery, insertValues);
    const ticket = insertResult.rows[0];

    const generatedCode = `TKT-${String(ticket.id).padStart(3, '0')}`;

    const updateResult = await client.query(
      `
      UPDATE tickets
      SET code = $1
      WHERE id = $2
      RETURNING *
      `,
      [generatedCode, ticket.id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      ok: true,
      ticket: updateResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Erro ao criar ticket',
      error: error.message,
      detail: error.detail || null,
      code: error.code || null
    });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3001;

app.get('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM tickets WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Ticket não encontrado',
      });
    }

    res.json({
      ok: true,
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Erro ao buscar ticket',
      error: error.message
    });
  }
});

app.put('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      title,
      description,
      requester_id,
      assignee_id,
      category_id,
      status_id,
      priority_id
    } = req.body;

    const query = `
      UPDATE tickets
      SET
        code = $1,
        title = $2,
        description = $3,
        requester_id = $4,
        assignee_id = $5,
        category_id = $6,
        status_id = $7,
        priority_id = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      code,
      title,
      description,
      requester_id,
      assignee_id || null,
      category_id,
      status_id,
      priority_id,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Ticket não encontrado',
      });
    }

    res.json({
      ok: true,
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Erro ao atualizar ticket',
      error: error.message,
      detail: error.detail || null
    });
  }
});

app.delete('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tickets WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Ticket não encontrado',
      });
    }

    res.json({
      ok: true,
      message: 'Ticket removido com sucesso',
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Erro ao deletar ticket',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});