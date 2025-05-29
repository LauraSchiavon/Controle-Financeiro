import { openDb } from "../../../../lib/db"; // Caminho para o banco
import { NextRequest, NextResponse } from "next/server";

// GET – Retorna todas as transações com todos os campos
export async function GET() {
  const db = await openDb();
  const transacoes = await db.all(
    "SELECT * FROM transacoes ORDER BY data DESC"
  );
  return NextResponse.json(transacoes);
}

// POST – Adiciona uma nova transação (agora completa)
export async function POST(req: NextRequest) {
  // Pegamos todos os campos do body, incluindo os novos
  const { titulo, valor, tipo, data, forma_pagamento, categoria } =
    await req.json();

  const db = await openDb();

  // Inserimos todos os campos na tabela
  await db.run(
    `
    INSERT INTO transacoes 
      (titulo, valor, tipo, data, forma_pagamento, categoria)
    VALUES 
      (?, ?, ?, ?, ?, ?)
  `,
    titulo,
    valor,
    tipo,
    data,
    forma_pagamento,
    categoria
  );

  return NextResponse.json(
    { message: "Transação criada com sucesso" },
    { status: 201 }
  );
}
