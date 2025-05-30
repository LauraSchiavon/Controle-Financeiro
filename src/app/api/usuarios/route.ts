// src/app/api/usuarios/route.ts
import { openDb } from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { nome, email, senha, profissao, telefone } = await req.json();
    const db = await openDb();

    const existe = await db.get(
      "SELECT * FROM usuarios WHERE email = ?",
      email
    );
    if (existe) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    await db.run(
      "INSERT INTO usuarios (nome, email, senha, profissao, telefone) VALUES (?, ?, ?, ?, ?)",
      nome,
      email,
      senha,
      profissao,
      telefone
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const db = await openDb();
    const usuarios = await db.all("SELECT * FROM usuarios");
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
