// src/app/home/page.tsx
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
  const [empresas, setEmpresas] = useState<Empresa[]>([]); // Armazena empresas do usuário
  const [novaEmpresa, setNovaEmpresa] = useState(""); // Input controlado para nova empresa
  const router = useRouter();

  // Pega o ID do usuário logado salvo no localStorage
  const usuario_id =
    typeof window !== "undefined" ? localStorage.getItem("usuario_id") : null;

  // Carrega as empresas do usuário logado assim que a página for montada
  useEffect(() => {
    if (!usuario_id) return;

    // Faz requisição para a API, filtrando pelo usuário logado
    fetch(`/api/empresas?usuario_id=${usuario_id}`)
      .then((res) => res.json())
      .then((data) => setEmpresas(data)); // Atualiza o estado com as empresas retornadas
  }, [usuario_id]);

  // Função que adiciona uma nova empresa para o usuário
  const adicionarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaEmpresa || !usuario_id) return;

    const res = await fetch("/api/empresas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: novaEmpresa,
        usuario_id, // ✅ associa a empresa ao usuário logado
      }),
    });

    if (res.ok) {
      const nova = await res.json();
      setEmpresas((prev) => [...prev, nova]); // Adiciona a nova empresa na tela
      setNovaEmpresa(""); // Limpa o campo de input
    } else {
      console.error("Erro ao salvar empresa");
    }
  };

  // Redireciona para o dashboard da empresa clicada

  const acessarEmpresa = (empresaId: number) => {
    localStorage.setItem("empresa_id", String(empresaId)); // salva no localStorage
    router.push(`/empresas/${empresaId}/dashboard`); // redireciona pra onde quiser
  };

  return (
    <Grid>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Minhas Empresas
        </h1>

        {/* Formulário para cadastrar nova empresa */}
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

        {/* Lista de empresas do usuário */}
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
