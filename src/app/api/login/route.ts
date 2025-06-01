// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openDb } from "../../../../lib/db";
import jwt from "jsonwebtoken";

// POST – Autenticar usuário
export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();

  const db = await openDb();
  const usuario = await db.get(
    "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
    email,
    senha
  );

  if (!usuario) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  // 🔐 Gerar token JWT
  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // 🍪 Definir cookie com o token
  const response = NextResponse.json({ message: "Login bem-sucedido" });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });

  return response;
}
