"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";
import TransacoesTable from "@/components/TransacoesTable";
import { Transacao } from "@/components/TransacaoItem";
import TransacaoForm from "@/components/TransacaoForm";
import FiltroTransacoes from "@/components/FiltroTransacoes";
import { useParams } from "next/navigation";
import ImportarTransacoes from "@/components/ImportarTransacoes";

export default function DashboardPage() {
  const params = useParams();
  const id = params?.id as string;

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filtros, setFiltros] = useState<any>({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const fetchTransacoes = async () => {
    try {
      const res = await fetch(`/api/empresas/${id}/transacoes`);
      const data = await res.json();
      if (Array.isArray(data)) setTransacoes(data);
      else setTransacoes([]);
    } catch (error) {
      console.error("❌ Erro inesperado:", error);
      setTransacoes([]);
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
      (!filtros.nicho || t.nicho_nome === filtros.nicho) &&
      (!filtros.cartao || t.banco === filtros.cartao) &&
      (!filtros.fornecedor ||
        t.fornecedor
          ?.toLowerCase()
          .includes(filtros.fornecedor.toLowerCase())) &&
      (!filtros.valor || t.valor === Number(filtros.valor)) &&
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
        <h1 className="text-3xl font-bold mb-6 text-[#000] dark:text-[#f1ecdf]">
          Minhas Transações
        </h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-[#f58723] text-white px-4 py-2 rounded-xl shadow hover:brightness-90 transition"
          >
            {mostrarFormulario ? "Fechar formulário" : "Nova transação"}
          </button>

          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="bg-[#c7ba99] text-black px-4 py-2 rounded-xl shadow hover:brightness-95 transition"
          >
            {mostrarFiltros ? "Fechar filtros" : "Filtrar transações"}
          </button>
        </div>

        <ImportarTransacoes
          onImportado={() => {
            fetchTransacoes();
            setMensagem("Transações importadas com sucesso!");
            setTimeout(() => setMensagem(null), 3000);
          }}
          empresaId={Number(id)}
        />
        {mensagem && (
          <div className="bg-[#f58723] border border-[#f58723] text-white px-4 py-2 rounded mb-4 shadow-md">
            {mensagem}
          </div>
        )}
        {mostrarFormulario && (
          <TransacaoForm onSuccess={fetchTransacoes} empresaId={Number(id)} />
        )}

        {mostrarFiltros && (
          <FiltroTransacoes
            filtros={{ ...filtros, empresaId: Number(id) }}
            onChange={(novos) =>
              setFiltros({ ...novos, empresaId: Number(id) })
            }
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#d4c9ad] text-black p-4 rounded-xl shadow">
            <h3 className="text-sm font-semibold">Total de Entradas</h3>
            <p className="text-2xl font-bold">
              R$ {totalEntradas.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="bg-[#f1ecdf] text-black p-4 rounded-xl shadow">
            <h3 className="text-sm font-semibold">Total de Saídas</h3>
            <p className="text-2xl font-bold">
              R$ {totalSaidas.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="bg-[#c7ba99] text-black p-4 rounded-xl shadow">
            <h3 className="text-sm font-semibold">Saldo Final</h3>
            <p className="text-2xl font-bold">
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
