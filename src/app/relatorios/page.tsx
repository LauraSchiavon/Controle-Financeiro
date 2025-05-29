"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";
import ResumoGraficos from "@/components/ResumoGraficos";
import { Transacao } from "@/components/TransacaoItem";
import MetaForm from "@/components/MetaForm";
import MetasPorCategoria from "@/components/MetasPorCategoria";
import FiltroPeriodo from "@/components/FiltroPeriodo";
import ComparativoMensal from "@/components/ComparativoMensal";
import ExportarRelatorio from "@/components/ExportarRelatorio";

// Tipo da meta
interface Meta {
  id: number;
  categoria: string;
  limite: number;
}

export default function RelatoriosPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1
  ); // mês atual (1 a 12)
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );
  const transacoesFiltradas = transacoes.filter((t) => {
    const data = new Date(t.data);
    return (
      data.getMonth() + 1 === mesSelecionado &&
      data.getFullYear() === anoSelecionado
    );
  });

  // Carrega transações
  const fetchTransacoes = async () => {
    const res = await fetch("/api/transacoes");
    const data = await res.json();
    setTransacoes(data);
  };

  // Carrega metas
  const fetchMetas = async () => {
    const res = await fetch("/api/metas");
    const data = await res.json();
    setMetas(data);
  };

  // Ao carregar a página, busca transações e metas
  useEffect(() => {
    fetchTransacoes();
    fetchMetas();
  }, []);

  return (
    <Grid>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Relatórios
        </h1>
        <ExportarRelatorio transacoes={transacoesFiltradas} />

        <FiltroPeriodo
          mesSelecionado={mesSelecionado}
          anoSelecionado={anoSelecionado}
          onChange={(mes, ano) => {
            setMesSelecionado(mes);
            setAnoSelecionado(ano);
          }}
        />

        {/* Gráficos de pizza e barra */}
        <ResumoGraficos transacoes={transacoesFiltradas} />
        <ComparativoMensal transacoes={transacoes} />

        {/* Formulário para adicionar metas */}
        <MetaForm onSuccess={fetchMetas} />

        {/* Visualização das metas cadastradas com barra de progresso */}
        <MetasPorCategoria
          transacoes={transacoes}
          metas={metas}
          onUpdate={fetchMetas}
        />
      </div>
    </Grid>
  );
}
