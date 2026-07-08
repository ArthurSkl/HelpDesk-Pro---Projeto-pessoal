const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ ok: false, message: 'Nome, e-mail e senha são obrigatórios' });
      }

      if (password.length < 4) {
        return res.status(400).json({ ok: false, message: 'Senha deve ter no mínimo 4 caracteres' });
      }

      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(409).json({ ok: false, message: 'E-mail já cadastrado' });
      }

      const user = await User.create({ name, email, password, role });

      res.status(201).json({
        ok: true,
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Erro ao cadastrar usuário' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ ok: false, message: 'E-mail e senha são obrigatórios' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ ok: false, message: 'Credenciais inválidas' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ ok: false, message: 'Credenciais inválidas' });
      }

      res.json({
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Erro ao fazer login' });
    }
  },
};

module.exports = authController;
