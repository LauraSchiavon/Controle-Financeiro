// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Grid from "@/components/Grid";

export default function LoginPage() {
  // Estados para email, senha e mensagens de erro
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  // Função chamada ao submeter o formulário de login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Busca todos os usuários cadastrados no localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    // Verifica se existe um usuário com o email e senha fornecidos
    const usuario = usuarios.find(
      (u: any) => u.email === email && u.senha === senha
    );

    // Se não encontrar, mostra mensagem de erro
    if (!usuario) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    // ✅ Se login for bem-sucedido, salva o ID do usuário logado no localStorage
    localStorage.setItem("usuario_id", String(usuario.id));

    // Redireciona para a página home
    router.push("/home");
  };

  return (
    <Grid>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow text-black">
        <h1 className="text-2xl font-bold mb-4">Entrar</h1>

        {/* Exibe erro caso login falhe */}
        {erro && <p className="text-red-600 text-sm mb-2">{erro}</p>}

        {/* Formulário de login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Entrar
          </button>
        </form>

        {/* Link para tela de cadastro */}
        <p className="text-sm mt-4 text-center">
          Sou novo aqui?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Cadastrar
          </a>
        </p>
      </div>
    </Grid>
  );
}
