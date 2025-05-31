// src/app/api/transacoes/[id]/route.ts
import { openDb } from "../../../../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

// Rota DELETE para excluir uma transação
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await openDb();

  // Deleta do banco pelo ID
  await db.run("DELETE FROM transacoes WHERE id = ?", params.id);

  return NextResponse.json({ message: "Transação excluída com sucesso" });
}
