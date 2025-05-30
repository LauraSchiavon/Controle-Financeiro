// src/app/api/empresas/route.ts

import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../lib/db";

// ========================
// GET – Lista as empresas do usuário
// ========================
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const usuario_id = searchParams.get("usuario_id"); // Pega o ID do usuário via query param

  if (!usuario_id) {
    return NextResponse.json(
      { error: "Usuário não especificado" },
      { status: 400 }
    );
  }

  const db = await openDb();

  // Busca apenas empresas associadas ao usuário
  const empresas = await db.all(
    "SELECT * FROM empresas WHERE usuario_id = ?",
    usuario_id
  );

  return NextResponse.json(empresas);
}

// ========================
// POST – Cria uma nova empresa associada ao usuário
// ========================
export async function POST(req: NextRequest) {
  const { nome, usuario_id } = await req.json();

  // Validação dos campos obrigatórios
  if (!nome || !usuario_id) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const db = await openDb();

  // Cria a nova empresa no banco associada ao usuário
  const result = await db.run(
    "INSERT INTO empresas (nome, usuario_id) VALUES (?, ?)",
    nome,
    usuario_id
  );

  // Retorna a nova empresa criada
  return NextResponse.json({
    id: result.lastID,
    nome,
    usuario_id,
  });
}
