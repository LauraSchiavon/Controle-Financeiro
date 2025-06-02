// src/app/api/empresas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const usuario_id = searchParams.get("usuario_id");

  console.log("🔎 GET /api/empresas → usuario_id:", usuario_id);

  if (!usuario_id) {
    return NextResponse.json(
      { error: "Usuário não especificado" },
      { status: 400 }
    );
  }

  const db = await openDb();
  const empresas = await db.all(
    "SELECT * FROM empresas WHERE usuario_id = ?",
    usuario_id
  );

  console.log("📦 Empresas encontradas:", empresas);
  return NextResponse.json(empresas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nome, usuario_id } = body;

  console.log("📨 POST /api/empresas:", body);

  if (!nome || !usuario_id) {
    console.error("❌ Dados inválidos recebidos no POST");
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const db = await openDb();

  const result = await db.run(
    "INSERT INTO empresas (nome, usuario_id) VALUES (?, ?)",
    nome,
    usuario_id
  );

  const novaEmpresa = {
    id: result.lastID,
    nome,
    usuario_id,
  };

  console.log("✅ Empresa criada com sucesso:", novaEmpresa);

  return NextResponse.json(novaEmpresa);
}
