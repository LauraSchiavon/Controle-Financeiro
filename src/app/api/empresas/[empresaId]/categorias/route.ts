// src/app/api/empresas/[empresaId]/categorias/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../../../lib/db";

// GET – Listar categorias da empresa
export async function GET(
  req: NextRequest,
  { params }: { params: { empresaId: string } }
) {
  const tipo = req.nextUrl.searchParams.get("tipo");
  const db = await openDb();

  let query = `
    SELECT categorias.*, nichos.tipo, nichos.nome AS nicho_nome
    FROM categorias
    JOIN nichos ON categorias.nicho_id = nichos.id
    WHERE categorias.empresa_id = ?
  `;
  const args = [params.empresaId];

  if (tipo) {
    query += " AND nichos.tipo = ?";
    args.push(tipo);
  }

  const categorias = await db.all(
    query + " ORDER BY nichos.nome, categorias.nome",
    args
  );
  return NextResponse.json(categorias);
}
// POST – Criar nova categoria
export async function POST(
  req: NextRequest,
  { params }: { params: { empresaId: string } }
) {
  const empresaId = Number(params.empresaId);
  const { nome, nicho_id } = await req.json();

  if (!nome || !nicho_id) {
    return NextResponse.json(
      { error: "Dados inválidos para criar categoria" },
      { status: 400 }
    );
  }

  const db = await openDb();
  await db.run(
    "INSERT INTO categorias (nome, empresa_id, nicho_id) VALUES (?, ?, ?)",
    nome,
    empresaId,
    nicho_id
  );

  return NextResponse.json(
    { message: "Categoria criada com sucesso" },
    { status: 201 }
  );
}
