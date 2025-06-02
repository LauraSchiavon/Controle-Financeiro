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

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, profissao, telefone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao criar conta");
        return;
      }

      // ✅ Armazena o ID do usuário no localStorage
      if (data.usuario?.id) {
        localStorage.setItem("usuario_id", String(data.usuario.id));
        console.log("✅ usuario_id salvo após cadastro:", data.usuario.id);
      } else {
        console.warn("⚠️ Resposta não contém usuario.id");
      }

      // ✅ Armazenar o token JWT no cookie
      document.cookie = `token=${data.token}; path=/`;

      // Redireciona para página inicial após login automático
      router.push("/home");
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setErro("Erro inesperado ao registrar.");
    }
  };

  return (
    <Grid>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow text-black">
        <h1 className="text-2xl font-bold mb-4">Criar conta</h1>

        {erro && <p className="text-red-600 text-sm mb-2">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Grid>
  );
}
