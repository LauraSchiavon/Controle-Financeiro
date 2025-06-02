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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErro(data.error || "Erro ao fazer login");
      return;
    }

    // ✅ Salva o ID do usuário no localStorage
    if (data.usuario?.id) {
      localStorage.setItem("usuario_id", data.usuario.id);
      console.log("👤 usuario_id salvo:", data.usuario.id);
    } else {
      console.warn("⚠️ Resposta sem ID de usuário.");
    }

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
