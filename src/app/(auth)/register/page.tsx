// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Grid from "@/components/Grid";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [profissao, setProfissao] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha, profissao, telefone }),
    });

    if (res.ok) {
      router.push("/home");
    } else {
      const erro = await res.json();
      setErro(erro.error || "Erro ao criar conta");
    }
  };

  return (
    <Grid>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Criar conta</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            placeholder="Profissão"
            value={profissao}
            onChange={(e) => setProfissao(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded w-full hover:bg-gray-800"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Grid>
  );
}
