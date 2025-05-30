// src/app/api/empresas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const usuario_id = searchParams.get("usuario_id");

  const db = await openDb();
  const empresas = await db.all(
    "SELECT * FROM empresas WHERE usuario_id = ?",
    usuario_id
  );

  return NextResponse.json(empresas);
}

export async function POST(req: NextRequest) {
  const { nome, usuario_id } = await req.json();
  if (!nome || !usuario_id) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const db = await openDb();
  const result = await db.run(
    "INSERT INTO empresas (nome, usuario_id) VALUES (?, ?)",
    nome,
    usuario_id
  );

  return NextResponse.json({
    id: result.lastID,
    nome,
    usuario_id,
  });
}
