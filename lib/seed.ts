import { openDb } from "./db";

async function seed() {
  const db = await openDb();

  // Cria a tabela de transações com o campo cartao_id
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
      FOREIGN KEY (cartao_id) REFERENCES cartoes(id)
    );
  `);

  // Cria a tabela de metas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS metas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria TEXT NOT NULL,
      limite REAL NOT NULL
    );
  `);

  // Cria a tabela de cartões
  await db.exec(`
  CREATE TABLE IF NOT EXISTS cartoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    banco TEXT NOT NULL,
    final TEXT NOT NULL,
    limite REAL NOT NULL
  );
`);

  console.log("📦 Banco com estrutura nova criado com sucesso!");
}

seed();
