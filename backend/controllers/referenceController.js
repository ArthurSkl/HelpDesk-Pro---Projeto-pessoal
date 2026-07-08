const Reference = require('../src/models/Reference');

const referenceController = {
  async statuses(req, res) {
    try {
      const data = await Reference.getStatuses();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Erro ao buscar status' });
    }
  },

  async priorities(req, res) {
    try {
      const data = await Reference.getPriorities();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Erro ao buscar prioridades' });
    }
  },

  async categories(req, res) {
    try {
      const data = await Reference.getCategories();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Erro ao buscar categorias' });
    }
  },

  async users(req, res) {
    try {
      const data = await Reference.getUsers();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Erro ao buscar usuários' });
    }
  },
};

module.exports = referenceController;
