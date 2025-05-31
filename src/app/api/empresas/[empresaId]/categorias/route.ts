import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../../../lib/db";

// GET – Listar categorias da empresa
// ✅ Força a execução dinâmica, evita o erro de `params`
export const dynamic = "force-dynamic";

// GET – Listar categorias
export async function GET(
  req: NextRequest,
  context: { params: { empresaId: string } }
) {
  try {
    const { empresaId } = context.params;
    const tipo = req.nextUrl.searchParams.get("tipo");

    const db = await openDb();

    let query = `
      SELECT categorias.*, nichos.tipo, nichos.nome AS nicho_nome
      FROM categorias
      JOIN nichos ON categorias.nicho_id = nichos.id
      WHERE categorias.empresa_id = ?
    `;
    const args: any[] = [empresaId];

    if (tipo) {
      query += " AND nichos.tipo = ?";
      args.push(tipo);
    }

    const categorias = await db.all(
      query + " ORDER BY nichos.nome, categorias.nome",
      args
    );

    return NextResponse.json(categorias);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST – Criar nova categoria
export async function POST(req: NextRequest, context: any) {
  try {
    const { empresaId } = context.params;
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
  } catch (error) {
    console.error("❌ Erro ao criar categoria:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
