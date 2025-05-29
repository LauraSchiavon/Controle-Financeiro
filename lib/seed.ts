// lib/seed.ts
import { openDb } from "./db";

async function seed() {
  const db = await openDb();

  // Remove a tabela se já existir (opcional, apenas se estiver em desenvolvimento)
  await db.exec(`DROP TABLE IF EXISTS transacoes`);

  // Cria a tabela com os novos campos
  await db.exec(`
  CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    valor REAL NOT NULL,
    tipo TEXT CHECK(tipo IN ('entrada', 'saida')) NOT NULL,
    data TEXT NOT NULL,
    forma_pagamento TEXT NOT NULL,
    categoria TEXT NOT NULL
  );
`);

  // Inserindo dados de teste com os novos campos
  await db.run(`
    INSERT INTO transacoes (titulo, valor, tipo, data, forma_pagamento, categoria)
    VALUES 
      ('Salário', 3500.00, 'entrada', '2025-05-01', 'pix', 'salario'),
      ('Aluguel', 1200.00, 'saida', '2025-05-05', 'debito', 'moradia'),
      ('Mercado', 300.00, 'saida', '2025-05-10', 'credito', 'alimentacao');
  `);

  console.log("📦 Banco com estrutura nova criado com sucesso!");
}

seed();
