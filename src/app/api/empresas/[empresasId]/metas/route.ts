import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../../../lib/db";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID não informado" }, { status: 400 });
  }

  const db = await openDb();
  await db.run("DELETE FROM metas WHERE id = ?", id);

  return NextResponse.json({ message: "Meta excluída com sucesso" });
}

// GET: lista todas as metas
export async function GET() {
  try {
    const db = await openDb();
    const metas = await db.all("SELECT * FROM metas ORDER BY categoria ASC");
    return NextResponse.json(metas); // ✅ SEMPRE retorna um array JSON
  } catch (err) {
    console.error("Erro ao buscar metas:", err);
    return NextResponse.json([], { status: 200 }); // retorna array vazio em caso de falha
  }
}

export async function POST(req: NextRequest) {
  const { categoria, limite } = await req.json();
  const db = await openDb();

  // Verifica se já existe meta para essa categoria
  const existente = await db.get(
    "SELECT * FROM metas WHERE categoria = ?",
    categoria
  );

  if (existente) {
    return NextResponse.json(
      { error: "Já existe uma meta para essa categoria." },
      { status: 400 }
    );
  }

  await db.run(
    "INSERT INTO metas (categoria, limite) VALUES (?, ?)",
    categoria,
    limite
  );

  return NextResponse.json({ message: "Meta criada com sucesso" });
}
