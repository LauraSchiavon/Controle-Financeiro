// src/app/api/usuarios/route.ts
import { openDb } from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

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

    // ✅ Cria o usuário no banco
    const result = await db.run(
      "INSERT INTO usuarios (nome, email, senha, profissao, telefone) VALUES (?, ?, ?, ?, ?)",
      nome,
      email,
      senha,
      profissao,
      telefone
    );

    const novoUsuario = {
      id: result.lastID,
      nome,
      email,
    };

    const token = jwt.sign(novoUsuario, JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Agora retornamos o usuário + token para o front
    return NextResponse.json({
      token,
      usuario: novoUsuario,
    });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
