import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../../../lib/db";

// GET – Listar nichos da empresa
export async function GET(
  req: NextRequest,
  { params }: { params: { empresaId: string } }
) {
  try {
    const db = await openDb();
    const nichos = await db.all(
      "SELECT * FROM nichos WHERE empresa_id = ? ORDER BY nome",
      params.empresaId
    );
    return NextResponse.json(nichos);
  } catch (err) {
    console.error("ERRO GET /nichos:", err);
    return NextResponse.json(
      { error: "Erro interno ao buscar nichos" },
      { status: 500 }
    );
  }
}

// POST – Criar novo nicho
export async function POST(
  req: NextRequest,
  { params }: { params: { empresaId: string } }
) {
  try {
    const empresaId = Number(params.empresaId);
    const { nome, tipo } = await req.json();

    console.log("🚀 Recebido:", { nome, tipo, empresaId });

    if (!nome || !tipo || isNaN(empresaId)) {
      return NextResponse.json(
        {
          error:
            "Dados inválidos para criar nicho (nome, tipo ou empresaId ausente)",
        },
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
  } catch (err) {
    console.error("ERRO POST /nichos:", err);
    return NextResponse.json(
      { error: "Erro interno ao criar nicho" },
      { status: 500 }
    );
  }
}
