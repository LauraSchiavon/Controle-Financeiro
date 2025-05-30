// src/app/api/cartoes/route.ts
import { openDb } from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET – listar
export async function GET() {
  const db = await openDb();
  const cartoes = await db.all("SELECT * FROM cartoes ORDER BY banco");
  return NextResponse.json(cartoes);
}

// POST – criar (verifica duplicata)
export async function POST(req: NextRequest) {
  const { banco, final, limite } = await req.json();
  if (!banco || !final || !limite) {
    return NextResponse.json({ error: "Campos obrigatórios" }, { status: 400 });
  }

  const db = await openDb();
  const existente = await db.get(
    "SELECT * FROM cartoes WHERE banco = ? AND final = ?",
    banco,
    final
  );

  if (existente) {
    return NextResponse.json(
      { error: "Cartão já cadastrado" },
      { status: 409 }
    );
  }

  await db.run(
    "INSERT INTO cartoes (banco, final, limite) VALUES (?, ?, ?)",
    banco,
    final,
    limite
  );
  return NextResponse.json(
    { message: "Cartão criado com sucesso" },
    { status: 201 }
  );
}

// PUT – editar
export async function PUT(req: NextRequest) {
  const { id, banco, final, limite } = await req.json();
  const db = await openDb();
  await db.run(
    "UPDATE cartoes SET banco = ?, final = ?, limite = ? WHERE id = ?",
    banco,
    final,
    limite,
    id
  );
  return NextResponse.json({ message: "Cartão atualizado" });
}

// DELETE – excluir
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const db = await openDb();
  await db.run("DELETE FROM cartoes WHERE id = ?", id);
  return NextResponse.json({ message: "Cartão excluído" });
}
