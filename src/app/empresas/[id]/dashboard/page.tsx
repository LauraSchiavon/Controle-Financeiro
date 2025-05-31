"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";
import TransacoesTable from "@/components/TransacoesTable";
import { Transacao } from "@/components/TransacaoItem";
import TransacaoForm from "@/components/TransacaoForm";
import FiltroTransacoes from "@/components/FiltroTransacoes";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const params = useParams();
  const id = params?.id as string;

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filtros, setFiltros] = useState<any>({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const fetchTransacoes = async () => {
    try {
      const res = await fetch(`/api/empresas/${id}/transacoes`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setTransacoes(data);
      } else {
        console.error("❌ Erro ao buscar transações:", data);
        setTransacoes([]); // Garante que o valor seja um array
      }
    } catch (error) {
      console.error("❌ Erro inesperado ao buscar transações:", error);
      setTransacoes([]); // Em caso de falha
    }
  };
  useEffect(() => {
    if (id) fetchTransacoes();
  }, [id]);

  const handleDelete = async (transacaoId: number) => {
    const confirm = window.confirm("Tem certeza que deseja excluir?");
    if (!confirm) return;

    await fetch(`/api/empresas/${id}/transacoes/${transacaoId}`, {
      method: "DELETE",
    });

    fetchTransacoes();
  };

  const transacoesFiltradas = transacoes.filter((t) => {
    return (
      (!filtros.titulo ||
        t.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())) &&
      (!filtros.tipo || t.tipo === filtros.tipo) &&
      (!filtros.forma_pagamento ||
        t.forma_pagamento === filtros.forma_pagamento) &&
      (!filtros.categoria || t.categoria_nome === filtros.categoria) &&
      (!filtros.data || t.data === filtros.data)
    );
  });

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

        {mostrarFormulario && (
          <TransacaoForm onSuccess={fetchTransacoes} empresaId={Number(id)} />
        )}

        {mostrarFiltros && (
          <FiltroTransacoes filtros={filtros} onChange={setFiltros} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 text-green-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold">Total de Entradas</h3>
            <p className="text-xl font-bold">
              R$ {totalEntradas.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="bg-red-100 text-red-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold">Total de Saídas</h3>
            <p className="text-xl font-bold">
              R$ {totalSaidas.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="bg-gray-100 text-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold">Saldo Final</h3>
            <p className="text-xl font-bold">
              R$ {saldo.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        <TransacoesTable
          transacoes={transacoesFiltradas}
          onDelete={handleDelete}
        />
      </div>
    </Grid>
  );
}
