const Ticket = require('../src/models/Ticket');

const ticketsController = {
  async list(req, res) {
    try {
      const tickets = await Ticket.findAll();
      res.json(tickets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Erro ao buscar tickets' });
    }
  },

  async getById(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ ok: false, message: 'Ticket não encontrado' });
      }
      res.json({ ok: true, ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Erro ao buscar ticket', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { title, description, requester_id, assignee_id, category_id, status_id, priority_id } = req.body;

      const missing = []
      if (!title) missing.push('title')
      if (!description) missing.push('description')
      if (!requester_id) missing.push('requester_id')
      if (!category_id) missing.push('category_id')
      if (!status_id) missing.push('status_id')
      if (!priority_id) missing.push('priority_id')

      if (missing.length > 0) {
        return res.status(400).json({
          ok: false,
          message: `Campos obrigatórios faltando: ${missing.join(', ')}`,
          missing,
          received: req.body,
        });
      }

      const ticket = await Ticket.create(req.body);
      res.status(201).json({ ok: true, ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        message: 'Erro ao criar ticket',
        error: error.message,
        detail: error.detail || null,
        code: error.code || null,
      });
    }
  },

  async update(req, res) {
    try {
      const ticket = await Ticket.update(req.params.id, req.body);
      if (!ticket) {
        return res.status(404).json({ ok: false, message: 'Ticket não encontrado' });
      }
      res.json({ ok: true, ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        message: 'Erro ao atualizar ticket',
        error: error.message,
        detail: error.detail || null,
      });
    }
  },

  async delete(req, res) {
    try {
      const ticket = await Ticket.delete(req.params.id);
      if (!ticket) {
        return res.status(404).json({ ok: false, message: 'Ticket não encontrado' });
      }
      res.json({ ok: true, message: 'Ticket removido com sucesso', ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Erro ao deletar ticket', error: error.message });
    }
  },
};

module.exports = ticketsController;
