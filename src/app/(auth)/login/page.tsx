// src/app/login/page.tsx
"use client"; // Habilita uso de hooks no componente (Next.js)

import React, { useState } from "react";
import Grid from "@/components/Grid"; // Componente para manter o layout padronizado

export default function LoginPage() {
  // useState para controlar os campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função que será chamada ao enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita o reload da página

    // Aqui futuramente será feita uma chamada para o backend
    console.log("Login com:", email, password);
  };

  return (
    // Usamos o Grid para manter o conteúdo centralizado e com margem padrão
    <Grid>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
        {/* Título da página */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Entrar</h1>

        {/* Formulário de login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de email */}
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Atualiza estado do email
              required
            />
          </div>

          {/* Campo de senha */}
          <div>
            <label className="block text-gray-600 mb-1">Senha</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Atualiza estado da senha
              required
            />
          </div>

          {/* Botão de envio do formulário */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </Grid>
  );
}
