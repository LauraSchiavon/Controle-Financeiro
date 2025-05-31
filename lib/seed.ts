// lib/seed.ts
import { openDb } from "./db";

async function seed() {
  const db = await openDb();
  await db.exec(`DROP TABLE IF EXISTS categorias`);
  await db.exec(`DROP TABLE IF EXISTS nichos`);

  // 👤 Usuários
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      profissao TEXT,
      telefone TEXT
    );
  `);

  // 🏢 Empresas (ligadas ao usuário)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS empresas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
  `);

  // 💳 Cartões (ligados à empresa)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cartoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      banco TEXT NOT NULL,
      final TEXT NOT NULL,
      limite REAL NOT NULL,
      empresa_id INTEGER NOT NULL,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    );
  `);

  // 📊 Transações (ligadas ao cartão e à empresa)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS transacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      valor REAL NOT NULL,
      tipo TEXT CHECK(tipo IN ('entrada', 'saida')) NOT NULL,
      data TEXT NOT NULL,
      forma_pagamento TEXT NOT NULL,
      categoria TEXT NOT NULL,
      cartao_id INTEGER,
      empresa_id INTEGER NOT NULL,
      FOREIGN KEY (cartao_id) REFERENCES cartoes(id),
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    );
  `);

  // 🎯 Metas (ligadas à empresa)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS metas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria TEXT NOT NULL,
      limite REAL NOT NULL,
      empresa_id INTEGER NOT NULL,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    );
  `);

  // 🧩 Nichos
  await db.exec(`
  CREATE TABLE IF NOT EXISTS nichos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tipo TEXT CHECK(tipo IN ('entrada', 'saida')) NOT NULL,
    empresa_id INTEGER NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
  );
`);

  // 🏷️ Categorias
  await db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    nicho_id INTEGER NOT NULL,
    empresa_id INTEGER NOT NULL,
    FOREIGN KEY (nicho_id) REFERENCES nichos(id),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
  );
`);
  console.log("✅ Banco recriado com todas as tabelas atualizadas!");
}

seed();
