// src/app/api/empresas/[empresaId]/metas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../../../lib/db";

// Utilitário para extrair empresaId da URL
function getEmpresaIdFromPath(pathname: string): number | null {
  const match = pathname.match(/\/empresas\/(\d+)/);
  return match ? Number(match[1]) : null;
}

// ✅ GET: lista todas as metas da empresa
export async function GET(req: NextRequest) {
  try {
    const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
    if (!empresaId) {
      return NextResponse.json({ error: "empresaId ausente" }, { status: 400 });
    }

    const db = await openDb();
    const metas = await db.all(
      "SELECT * FROM metas WHERE empresa_id = ? ORDER BY categoria ASC",
      empresaId
    );

    return NextResponse.json(metas);
  } catch (err) {
    console.error("Erro ao buscar metas:", err);
    return NextResponse.json([], { status: 200 });
  }
}

// ✅ POST: cria nova meta vinculada à empresa
export async function POST(req: NextRequest) {
  const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
  const { categoria, limite } = await req.json();

  if (!empresaId || !categoria || !limite) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const db = await openDb();

  // Garante que só pode haver uma meta por categoria por empresa
  const existente = await db.get(
    "SELECT * FROM metas WHERE categoria = ? AND empresa_id = ?",
    categoria,
    empresaId
  );

  if (existente) {
    return NextResponse.json(
      { error: "Já existe uma meta para essa categoria." },
      { status: 400 }
    );
  }

  await db.run(
    "INSERT INTO metas (categoria, limite, empresa_id) VALUES (?, ?, ?)",
    categoria,
    limite,
    empresaId
  );

  return NextResponse.json({ message: "Meta criada com sucesso" });
}

// ✅ DELETE: exclui meta da empresa
export async function DELETE(req: NextRequest) {
  const empresaId = getEmpresaIdFromPath(req.nextUrl.pathname);
  const { id } = await req.json();

  if (!empresaId || !id) {
    return NextResponse.json(
      { error: "ID ou empresaId ausente" },
      { status: 400 }
    );
  }

  const db = await openDb();
  await db.run(
    "DELETE FROM metas WHERE id = ? AND empresa_id = ?",
    id,
    empresaId
  );

  return NextResponse.json({ message: "Meta excluída com sucesso" });
}
