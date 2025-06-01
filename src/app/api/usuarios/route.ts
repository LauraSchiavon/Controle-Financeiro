// src/app/api/usuarios/route.ts
import { openDb } from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"; // ⚠️ Defina no .env.local

export async function POST(req: NextRequest) {
  try {
    const { nome, email, senha, profissao, telefone } = await req.json();
    const db = await openDb();

    // 🔍 Verifica se já existe um usuário com o e-mail
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

    // ✅ Cria o usuário no banco de dados
    const result = await db.run(
      "INSERT INTO usuarios (nome, email, senha, profissao, telefone) VALUES (?, ?, ?, ?, ?)",
      nome,
      email,
      senha,
      profissao,
      telefone
    );

    // ✅ Cria o token JWT com o ID do usuário recém-criado
    const token = jwt.sign(
      {
        id: result.lastID,
        nome,
        email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔐 Retorna o token para o front
    return NextResponse.json({ token });
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
