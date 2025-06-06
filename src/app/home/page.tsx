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
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("usuario_id");
      setUsuarioId(id);
    }
  }, []);

  useEffect(() => {
    if (!usuarioId) return;

    fetch(`/api/empresas?usuario_id=${usuarioId}`)
      .then((res) => res.json())
      .then((data) => setEmpresas(data));
  }, [usuarioId]);

  const adicionarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaEmpresa || !usuarioId) return;

    const res = await fetch("/api/empresas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novaEmpresa, usuario_id: usuarioId }),
    });

    const data = await res.json();

    if (res.ok) {
      setEmpresas((prev) => [...prev, data]);
      setNovaEmpresa("");
    }
  };

  const acessarEmpresa = (empresaId: number) => {
    localStorage.setItem("empresa_id", String(empresaId));

    // 🔔 Dispara evento customizado para avisar a navbar
    window.dispatchEvent(new Event("empresaSelecionada"));

    // Redireciona
    window.location.href = `/empresas/${empresaId}/dashboard`;
  };

  return (
    <Grid>
      <div className="mt-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-[#000000] dark:text-[#f1ecdf]">
          Minhas Empresas
        </h1>

        <form
          onSubmit={adicionarEmpresa}
          className="flex flex-col sm:flex-row gap-4 mb-8 bg-[#f1ecdf] dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-lg"
        >
          <input
            placeholder="Nome da empresa"
            value={novaEmpresa}
            onChange={(e) => setNovaEmpresa(e.target.value)}
            className="flex-1 px-4 py-2 bg-white dark:bg-[#2a2a2a] border border-[#c7ba99] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f58723]"
            required
          />
          <button
            type="submit"
            className="bg-[#f58723] text-white px-5 py-2 rounded-lg hover:bg-[#d46f1a] transition"
          >
            Cadastrar
          </button>
        </form>

        <div className="space-y-4">
          {empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="bg-[#f1ecdf] dark:bg-[#1a1a1a] border border-[#d4c9ad] rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
            >
              <span className="text-[#000000] dark:text-[#f1ecdf] font-medium text-lg">
                {empresa.nome}
              </span>
              <button
                onClick={() => acessarEmpresa(empresa.id)}
                className="text-[#f58723] hover:underline font-medium"
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
