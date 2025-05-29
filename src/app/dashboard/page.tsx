"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";
import TransacoesTable from "@/components/TransacoesTable";
import { Transacao } from "@/components/TransacaoItem";
import TransacaoForm from "@/components/TransacaoForm";
import FiltroTransacoes from "@/components/FiltroTransacoes";

export default function DashboardPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filtros, setFiltros] = useState<any>({});

  // Novos estados para controlar visibilidade
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const fetchTransacoes = () => {
    fetch("/api/transacoes")
      .then((res) => res.json())
      .then((data) => setTransacoes(data));
  };

  useEffect(() => {
    fetchTransacoes();
  }, []);
  // Função para deletar uma transação por ID
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Tem certeza que deseja excluir?");
    if (!confirm) return;

    await fetch(`/api/transacoes/${id}`, {
      method: "DELETE",
    });

    fetchTransacoes(); // Atualiza a lista após deletar
  };
  // Aplica os filtros à lista
  const transacoesFiltradas = transacoes.filter((t) => {
    return (
      (!filtros.titulo ||
        t.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())) &&
      (!filtros.tipo || t.tipo === filtros.tipo) &&
      (!filtros.forma_pagamento ||
        t.forma_pagamento === filtros.forma_pagamento) &&
      (!filtros.categoria || t.categoria === filtros.categoria) &&
      (!filtros.data || t.data === filtros.data)
    );
  });
  // Calcula totais com base nas transações filtradas
  const totalEntradas = transacoesFiltradas
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalSaidas = transacoesFiltradas
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalEntradas - totalSaidas;
  return (
    <Grid>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Minhas Transações
        </h1>

        {/* Botões para mostrar/ocultar formulário e filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            {mostrarFormulario ? "Fechar formulário" : "Nova transação"}
          </button>

          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            {mostrarFiltros ? "Fechar filtros" : "Filtrar transações"}
          </button>
        </div>

        {/* Formulário de adicionar nova transação */}
        {mostrarFormulario && <TransacaoForm onSuccess={fetchTransacoes} />}

        {/* Filtros */}
        {mostrarFiltros && (
          <FiltroTransacoes filtros={filtros} onChange={setFiltros} />
        )}

        {/* Totais gerais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Entradas */}
          <div className="bg-green-100 text-green-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold">Total de Entradas</h3>
            <p className="text-xl font-bold">
              R$ {totalEntradas.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* Saídas */}
          <div className="bg-red-100 text-red-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold">Total de Saídas</h3>
            <p className="text-xl font-bold">
              R$ {totalSaidas.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* Saldo */}
          <div className="bg-gray-100 text-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold">Saldo Final</h3>
            <p className="text-xl font-bold">
              R$ {saldo.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        {/* Tabela com os dados filtrados */}
        <TransacoesTable
          transacoes={transacoesFiltradas}
          onDelete={handleDelete}
        />
      </div>
    </Grid>
  );
}
