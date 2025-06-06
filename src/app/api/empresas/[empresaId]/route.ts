// src/app/api/empresas/[empresaId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../../lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { empresaId: string } }
) {
  console.log("📥 Buscando empresa com id:", params.empresaId);
  const db = await openDb();

  const empresa = await db.get("SELECT * FROM empresas WHERE id = ?", [
    params.empresaId,
  ]);

  if (!empresa) {
    return NextResponse.json(
      { error: "Empresa não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(empresa);
}
