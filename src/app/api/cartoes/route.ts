import { openDb } from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET – lista todos os cartões
export async function GET() {
  const db = await openDb();
  const cartoes = await db.all("SELECT * FROM cartoes");
  return NextResponse.json(cartoes);
}

// POST – cria um novo cartão
export async function POST(req: NextRequest) {
  const { banco, final, limite } = await req.json();

  if (!banco || !final || !limite) {
    return NextResponse.json({ error: "Campos obrigatórios" }, { status: 400 });
  }

  const db = await openDb();
  await db.run(
    "INSERT INTO cartoes (banco, final, limite) VALUES (?, ?, ?)",
    banco,
    final,
    limite
  );

  return NextResponse.json({ message: "Cartão criado" }, { status: 201 });
}
