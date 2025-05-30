// src/app/api/empresas/[empresaId]/transacoes/route.ts
import { openDb } from "../../../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

// 🔧 Utilitário para extrair empresaId da URL
function getEmpresaIdFromPath(pathname: string): number | null {
  const match = pathname.match(/\/empresas\/(\d+)/);
  return match ? Number(match[1]) : null;
}

// ✅ GET – listar transações da empresa
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
        c.banco 
      FROM transacoes t
      LEFT JOIN cartoes c ON t.cartao_id = c.id
      WHERE t.empresa_id = ?
      ORDER BY t.data DESC
      `,
      empresaId
    );

    return NextResponse.json(transacoes);
  } catch (error) {
    console.error("Erro no GET /transacoes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ✅ POST – criar nova transação para a empresa
export async function POST(req: NextRequest) {
  try {
    const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
    const { titulo, valor, tipo, data, categoria, forma_pagamento, cartao_id } =
      await req.json();

    if (
      !empresaId ||
      !titulo ||
      !valor ||
      !tipo ||
      !data ||
      !categoria ||
      !forma_pagamento
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const db = await openDb();

    await db.run(
      `
      INSERT INTO transacoes (
        titulo, valor, tipo, data, categoria, forma_pagamento, cartao_id, empresa_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      titulo,
      valor,
      tipo,
      data,
      categoria,
      forma_pagamento,
      cartao_id || null, // permite null
      empresaId
    );

    return NextResponse.json(
      { message: "Transação criada com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no POST /transacoes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
