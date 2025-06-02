"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";
import { useRouter } from "next/navigation";

// Interface para tipar os dados de empresa
interface Empresa {
  id: number;
  nome: string;
}

export default function HomePage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [novaEmpresa, setNovaEmpresa] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const router = useRouter();

  // Carrega o usuario_id do localStorage assim que a página for montada
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("usuario_id");
      console.log("👤 usuario_id carregado:", id);
      setUsuarioId(id);
    }
  }, []);

  // Carrega as empresas do usuário logado quando o ID estiver disponível
  useEffect(() => {
    if (!usuarioId) return;

    fetch(`/api/empresas?usuario_id=${usuarioId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Empresas carregadas:", data);
        setEmpresas(data);
      });
  }, [usuarioId]);

  // Adiciona nova empresa
  const adicionarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaEmpresa || !usuarioId) {
      console.warn("❌ Nome da empresa ou usuário_id ausente");
      return;
    }

    console.log("🚀 Enviando nova empresa:", {
      nome: novaEmpresa,
      usuario_id: usuarioId,
    });

    const res = await fetch("/api/empresas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: novaEmpresa,
        usuario_id: usuarioId,
      }),
    });

    const data = await res.json();
    console.log("🔁 Resposta da API:", res.status, data);

    if (res.ok) {
      setEmpresas((prev) => [...prev, data]);
      setNovaEmpresa("");
    } else {
      console.error("❌ Erro ao salvar empresa:", data);
    }
  };

  // Redireciona para o dashboard da empresa clicada
  const acessarEmpresa = (empresaId: number) => {
    localStorage.setItem("empresa_id", String(empresaId));
    router.push(`/empresas/${empresaId}/dashboard`);
  };

  return (
    <Grid>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Minhas Empresas
        </h1>

        {/* Formulário de cadastro */}
        <form
          onSubmit={adicionarEmpresa}
          className="flex gap-4 mb-6 bg-white dark:bg-gray-900 p-4 rounded shadow"
        >
          <input
            placeholder="Nome da empresa"
            value={novaEmpresa}
            onChange={(e) => setNovaEmpresa(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Cadastrar
          </button>
        </form>

        {/* Lista de empresas */}
        <div className="space-y-4">
          {empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="bg-gray-100 dark:bg-gray-800 rounded p-4 flex justify-between items-center"
            >
              <span className="text-gray-800 dark:text-white font-medium">
                {empresa.nome}
              </span>
              <button
                onClick={() => acessarEmpresa(empresa.id)}
                className="text-blue-600 hover:underline"
              >
                Acessar
              </button>
            </div>
          ))}
        </div>
      </div>
    </Grid>
  );
}
