"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";

export default function CategoriaPage() {
  const [empresaId, setEmpresaId] = useState<string | null>(null);

  const [tipoNicho, setTipoNicho] = useState("saida");
  const [nomeNicho, setNomeNicho] = useState("");
  const [nichos, setNichos] = useState<any[]>([]);

  const [nichoSelecionado, setNichoSelecionado] = useState("");
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [categorias, setCategorias] = useState<any[]>([]);

  // 🔵 Ao montar, carregar ID da empresa
  useEffect(() => {
    const id = localStorage.getItem("empresa_id");
    if (id) {
      console.log("empresa_id carregado:", id);
      setEmpresaId(id);
    } else {
      console.warn("empresa_id não encontrado no localStorage");
    }
  }, []);

  // 🔄 Buscar nichos
  const fetchNichos = async () => {
    try {
      const res = await fetch(`/api/empresas/${empresaId}/nichos`);
      const data = await res.json();
      setNichos(data);
    } catch (err) {
      console.error("Erro ao buscar nichos:", err);
    }
  };

  // 🔄 Buscar categorias
  const fetchCategorias = async () => {
    try {
      const res = await fetch(`/api/empresas/${empresaId}/categorias`);
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  // ▶️ Buscar dados ao carregar o empresaId
  useEffect(() => {
    if (empresaId) {
      fetchNichos();
      fetchCategorias();
    }
  }, [empresaId]);

  // ✅ Criar Nicho
  const criarNicho = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeNicho || !tipoNicho || !empresaId) return;

    try {
      const res = await fetch(`/api/empresas/${empresaId}/nichos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeNicho, tipo: tipoNicho }),
      });

      const data = await res.json(); // <- agora sempre terá resposta

      if (!res.ok) {
        console.error("❌ Erro ao criar nicho:", data);
        return;
      }

      console.log("✅ Nicho criado:", data);
      setNomeNicho("");
      fetchNichos();
    } catch (err) {
      console.error("Erro inesperado ao criar nicho:", err);
    }
  };

  // ✅ Criar Categoria
  const criarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCategoria || !nichoSelecionado || !empresaId) return;

    try {
      const res = await fetch(`/api/empresas/${empresaId}/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeCategoria,
          nicho_id: nichoSelecionado,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erro ao criar categoria:", data);
        return;
      }

      setNomeCategoria("");
      await fetchCategorias(); // 🔁 Atualiza após criar
    } catch (err) {
      console.error("Erro inesperado ao criar categoria:", err);
    }
  };

  return (
    <Grid>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Categorias Personalizadas
        </h1>

        {/* 🔷 Formulário Nicho */}
        <form
          onSubmit={criarNicho}
          className="bg-white dark:bg-gray-900 p-4 rounded mb-6 shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Novo Nicho</h2>
          <select
            value={tipoNicho}
            onChange={(e) => setTipoNicho(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          >
            <option value="saida">Saída</option>
            <option value="entrada">Entrada</option>
          </select>
          <input
            placeholder="Nome do nicho"
            value={nomeNicho}
            onChange={(e) => setNomeNicho(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Adicionar Nicho
          </button>
        </form>

        {/* 🟧 Formulário Categoria */}
        <form
          onSubmit={criarCategoria}
          className="bg-white dark:bg-gray-900 p-4 rounded mb-6 shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Nova Categoria</h2>
          <select
            value={nichoSelecionado}
            onChange={(e) => setNichoSelecionado(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          >
            <option value="">Selecione um nicho</option>
            {nichos.map((n) => (
              <option key={n.id} value={n.id}>
                {n.tipo === "saida" ? "Saída" : "Entrada"} - {n.nome}
              </option>
            ))}
          </select>
          <input
            placeholder="Nome da categoria"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Adicionar Categoria
          </button>
        </form>

        {/* ✅ Lista */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Categorias Cadastradas</h2>
          {categorias.map((cat) => (
            <div key={cat.id} className="flex justify-between py-1 text-white">
              <span>
                {cat.tipo === "saida" ? "Saída" : "Entrada"} - {cat.nicho_nome}{" "}
                → {cat.nome}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Grid>
  );
}
