import { openDb } from "../../../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

function getEmpresaIdFromPath(pathname: string): number | null {
  const match = pathname.match(/\/empresas\/(\d+)/);
  return match ? Number(match[1]) : null;
}

// GET – Listar transações
export async function GET(req: NextRequest) {
  try {
    const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
    if (!empresaId) {
      return NextResponse.json({ error: "empresaId ausente" }, { status: 400 });
    }

    const db = await openDb();
    const transacoes = await db.all(
      `
      SELECT 
        t.*, 
        c.banco,
        cat.nome AS categoria_nome,
        n.nome AS nicho_nome
      FROM transacoes t
      LEFT JOIN cartoes c ON t.cartao_id = c.id
      LEFT JOIN categorias cat ON t.categoria_id = cat.id
      LEFT JOIN nichos n ON t.nicho_id = n.id
      WHERE t.empresa_id = ?
      ORDER BY t.data DESC
      `,
      empresaId
    );

    return NextResponse.json(transacoes);
  } catch (error) {
    console.error("❌ Erro no GET /transacoes:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar transações" },
      { status: 500 }
    );
  }
}

// POST – Criar transação
export async function POST(req: NextRequest) {
  try {
    const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
    const {
      titulo,
      valor,
      tipo,
      data,
      fornecedor,
      categoria_id,
      nicho_id,
      forma_pagamento,
      cartao_id,
    } = await req.json();

    if (!empresaId || !titulo || !valor || !data) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // 🔧 Corrige valor se vier como string com 'R$', vírgula etc.
    const valorNumerico =
      typeof valor === "string"
        ? parseFloat(
            valor.replace("R$", "").replace(".", "").replace(",", ".").trim()
          )
        : valor;

    const db = await openDb();

    await db.run(
      `
      INSERT INTO transacoes (
        titulo, valor, tipo, data, fornecedor, categoria_id, nicho_id, forma_pagamento, cartao_id, empresa_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      titulo,
      valorNumerico,
      tipo || "saida",
      data,
      fornecedor || "",
      categoria_id || null,
      nicho_id || null,
      forma_pagamento || "",
      cartao_id || null,
      empresaId
    );

    return NextResponse.json(
      { message: "Transação criada com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erro no POST /transacoes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
