// src/app/api/transacoes/route.ts
import { openDb } from "../../../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET – listar transações
export async function GET() {
  const db = await openDb();
  const transacoes = await db.all(`
    SELECT 
      t.*, 
      c.banco 
    FROM transacoes t
    LEFT JOIN cartoes c ON t.cartao_id = c.id
    ORDER BY t.data DESC
  `);

  return NextResponse.json(transacoes);
}

// POST – criar nova transação
export async function POST(req: NextRequest) {
  const {
    titulo,
    valor,
    tipo,
    data,
    categoria,
    forma_pagamento,
    cartao_id, // <- esse campo vem do formulário
  } = await req.json();

  const db = await openDb();

  await db.run(
    `INSERT INTO transacoes (
      titulo, valor, tipo, data, categoria, forma_pagamento, cartao_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    titulo,
    valor,
    tipo,
    data,
    categoria,
    forma_pagamento,
    cartao_id
  );

  return NextResponse.json(
    { message: "Transação criada com sucesso" },
    { status: 201 }
  );
}
