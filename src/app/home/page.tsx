"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";
import { useRouter } from "next/navigation";

interface Empresa {
  id: number;
  nome: string;
}

export default function HomePage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [novaEmpresa, setNovaEmpresa] = useState("");
  const router = useRouter();

  const usuario_id =
    typeof window !== "undefined" ? localStorage.getItem("usuario_id") : null;

  useEffect(() => {
    const usuario_id = localStorage.getItem("usuario_id");
    if (!usuario_id) return;

    // Busca as empresas do usuário
    fetch(`/api/empresas?usuario_id=${usuario_id}`)
      .then((res) => res.json())
      .then((data) => setEmpresas(data));
  }, [usuario_id]);

  const adicionarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();

    const usuario_id = localStorage.getItem("usuario_id");
    if (!novaEmpresa || !usuario_id) return;

    const res = await fetch("/api/empresas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: novaEmpresa,
        usuario_id,
      }),
    });

    if (res.ok) {
      const nova = await res.json();
      setEmpresas((prev) => [...prev, nova]); // adiciona na tela
      setNovaEmpresa(""); // limpa o input
    } else {
      console.error("Erro ao salvar empresa");
    }
  };

  const acessarEmpresa = (empresaId: number) => {
    router.push(`/empresas/${empresaId}/dashboard`);
  };

  return (
    <Grid>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Minhas Empresas
        </h1>

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
