"use client";

import { useEffect, useState } from "react";
import Grid from "@/components/Grid";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  profissao?: string;
  telefone?: string;
}

export default function MeuPerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nome, setNome] = useState("");
  const [profissao, setProfissao] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) return;

    fetch(`/api/usuarios/${usuarioId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data);
        setNome(data.nome);
        setProfissao(data.profissao || "");
        setTelefone(data.telefone || "");
      });
  }, []);

  const atualizar = async () => {
    if (!usuario) return;

    await fetch(`/api/usuarios/${usuario.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, profissao, telefone }),
    });
    alert("Perfil atualizado!");
  };

  const deletar = async () => {
    if (!usuario) return;
    const confirm = window.confirm("Tem certeza que deseja excluir sua conta?");
    if (!confirm) return;

    await fetch(`/api/usuarios/${usuario.id}`, {
      method: "DELETE",
    });

    localStorage.removeItem("usuario_id");
    window.location.href = "/login";
  };

  return (
    <Grid>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow text-black">
        <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>

        <label className="block mb-1 font-medium">Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <label className="block mb-1 font-medium">Profissão</label>
        <input
          value={profissao}
          onChange={(e) => setProfissao(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <label className="block mb-1 font-medium">Telefone</label>
        <input
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <label className="block mb-1 font-medium">Email</label>
        <input
          value={usuario?.email || ""}
          disabled
          className="w-full border px-3 py-2 mb-4 rounded bg-gray-100"
        />

        <div className="flex justify-between">
          <button
            onClick={atualizar}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Salvar
          </button>
          <button
            onClick={deletar}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Excluir conta
          </button>
        </div>
      </div>
    </Grid>
  );
}
