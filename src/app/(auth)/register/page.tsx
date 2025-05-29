// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import Grid from "@/components/Grid";

export default function RegisterPage() {
  // Estados para os inputs do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cadastrar:", email, password);
    // Aqui vamos chamar a API futuramente
  };

  return (
    <Grid>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Criar conta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Senha</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Criar conta
          </button>
        </form>
      </div>
    </Grid>
  );
}
