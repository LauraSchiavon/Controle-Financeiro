// src/app/api/empresas/[empresaId]/cartoes/route.ts
import { openDb } from "../../../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

// 👇 Função utilitária para extrair o ID da empresa da URL
function getEmpresaIdFromPath(pathname: string): number | null {
  const match = pathname.match(/\/empresas\/(\d+)/);
  return match ? Number(match[1]) : null;
}

// ✅ GET – listar cartões da empresa
export async function GET(req: NextRequest) {
  try {
    const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
    if (!empresaId) {
      return NextResponse.json({ error: "empresaId ausente" }, { status: 400 });
    }

    const db = await openDb();
    const cartoes = await db.all(
      "SELECT * FROM cartoes WHERE empresa_id = ? ORDER BY banco",
      empresaId
    );

    return NextResponse.json(cartoes);
  } catch (error) {
    console.error("Erro no GET /cartoes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ✅ POST – criar novo cartão
export async function POST(req: NextRequest) {
  try {
    const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
    const { banco, final, limite } = await req.json();

    // Validação dos campos
    if (!empresaId || !banco || !final || !limite) {
      return NextResponse.json(
        { error: "Campos obrigatórios ou empresaId ausente" },
        { status: 400 }
      );
    }

    const db = await openDb();

    // Verifica se já existe cartão com mesmo banco e final na empresa
    const existe = await db.get(
      "SELECT * FROM cartoes WHERE banco = ? AND final = ? AND empresa_id = ?",
      banco,
      final,
      empresaId
    );

    if (existe) {
      return NextResponse.json(
        { error: "Cartão já cadastrado" },
        { status: 409 }
      );
    }

    // Cria o novo cartão
    await db.run(
      "INSERT INTO cartoes (banco, final, limite, empresa_id) VALUES (?, ?, ?, ?)",
      banco,
      final,
      limite,
      empresaId
    );

    return NextResponse.json(
      { message: "Cartão criado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no POST /cartoes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ✅ PUT – editar cartão
export async function PUT(req: NextRequest) {
  try {
    const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
    const { id, banco, final, limite } = await req.json();

    // Validação
    if (!empresaId || !id || !banco || !final || !limite) {
      return NextResponse.json(
        { error: "Campos obrigatórios ou empresaId ausente" },
        { status: 400 }
      );
    }

    const db = await openDb();

    // Atualiza o cartão, garantindo que pertença à empresa correta
    await db.run(
      "UPDATE cartoes SET banco = ?, final = ?, limite = ?, empresa_id = ? WHERE id = ? AND empresa_id = ?",
      banco,
      final,
      limite,
      empresaId,
      id,
      empresaId
    );

    return NextResponse.json({ message: "Cartão atualizado" });
  } catch (error) {
    console.error("Erro no PUT /cartoes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ✅ DELETE – excluir cartão
export async function DELETE(req: NextRequest) {
  try {
    const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
    const { id } = await req.json();

    if (!empresaId || !id) {
      return NextResponse.json(
        { error: "ID do cartão ou empresaId ausente" },
        { status: 400 }
      );
    }

    const db = await openDb();

    // Exclui cartão garantindo que pertence à empresa correta
    await db.run(
      "DELETE FROM cartoes WHERE id = ? AND empresa_id = ?",
      id,
      empresaId
    );

    return NextResponse.json({ message: "Cartão excluído" });
  } catch (error) {
    console.error("Erro no DELETE /cartoes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
