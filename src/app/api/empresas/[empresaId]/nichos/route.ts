import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../../../lib/db";

// GET – Listar nichos da empresa
// ✅ Evita erro ao acessar context.params
export const dynamic = "force-dynamic";

// GET – Listar nichos
export async function GET(
  req: NextRequest,
  context: { params: { empresaId: string } }
) {
  try {
    const { empresaId } = context.params;

    const db = await openDb();
    const nichos = await db.all(
      "SELECT * FROM nichos WHERE empresa_id = ? ORDER BY nome",
      empresaId
    );

    return NextResponse.json(nichos);
  } catch (error) {
    console.error("Erro ao buscar nichos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST – Criar novo nicho
export async function POST(req: NextRequest, context: any) {
  try {
    const { empresaId } = context.params;
    const { nome, tipo } = await req.json();

    if (!nome || !tipo || isNaN(Number(empresaId))) {
      return NextResponse.json(
        { error: "Dados inválidos (nome, tipo ou empresaId ausente)" },
        { status: 400 }
      );
    }

    const db = await openDb();
    await db.run(
      "INSERT INTO nichos (nome, tipo, empresa_id) VALUES (?, ?, ?)",
      nome,
      tipo,
      empresaId
    );

    return NextResponse.json(
      { message: "Nicho criado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ ERRO ao criar nicho:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar nicho" },
      { status: 500 }
    );
  }
}
