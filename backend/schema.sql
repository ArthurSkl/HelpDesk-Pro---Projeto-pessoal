-- ============================================================
-- HelpDesk Pro - Database Schema
-- Execute this file to create all tables and seed lookup data
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'requester',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ticket statuses
CREATE TABLE IF NOT EXISTS ticket_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Ticket priorities
CREATE TABLE IF NOT EXISTS ticket_priorities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 0
);

-- Ticket categories
CREATE TABLE IF NOT EXISTS ticket_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requester_id INTEGER NOT NULL REFERENCES users(id),
    assignee_id INTEGER REFERENCES users(id),
    category_id INTEGER NOT NULL REFERENCES ticket_categories(id),
    status_id INTEGER NOT NULL REFERENCES ticket_statuses(id),
    priority_id INTEGER NOT NULL REFERENCES ticket_priorities(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Seed lookup data
-- ============================================================

INSERT INTO ticket_statuses (name, sort_order) VALUES
  ('Aberto', 1),
  ('Em andamento', 2),
  ('Resolvido', 3),
  ('Fechado', 4)
ON CONFLICT DO NOTHING;

INSERT INTO ticket_priorities (name, level) VALUES
  ('Baixa', 1),
  ('Média', 2),
  ('Alta', 3),
  ('Crítica', 4)
ON CONFLICT DO NOTHING;

INSERT INTO ticket_categories (name) VALUES
  ('Suporte Técnico'),
  ('Financeiro'),
  ('Recursos Humanos'),
  ('Infraestrutura'),
  ('Outros')
ON CONFLICT DO NOTHING;
