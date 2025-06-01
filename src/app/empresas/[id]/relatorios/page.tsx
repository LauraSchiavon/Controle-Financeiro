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
import { useParams } from "next/navigation";
import ImportarTransacoes from "@/components/ImportarTransacoes";

// Tipo da meta
interface Meta {
  id: number;
  categoria: string;
  limite: number;
}

export default function RelatoriosPage() {
  const { id } = useParams(); // id da empresa pela URL
  const empresaId = Number(id);

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1
  ); // mês atual (1 a 12)
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );

  // Filtra transações pelo mês e ano selecionados
  const transacoesFiltradas = transacoes.filter((t) => {
    const data = new Date(t.data);
    return (
      data.getMonth() + 1 === mesSelecionado &&
      data.getFullYear() === anoSelecionado
    );
  });

  // Carrega transações da empresa
  const fetchTransacoes = async () => {
    const res = await fetch(`/api/empresas/${empresaId}/transacoes`);
    const data = await res.json();
    setTransacoes(data);
  };

  // Carrega metas da empresa
  const fetchMetas = async () => {
    const res = await fetch(`/api/empresas/${empresaId}/metas`);
    const data = await res.json();
    setMetas(data);
  };

  // Ao carregar a página, busca transações e metas
  useEffect(() => {
    if (empresaId) {
      fetchTransacoes();
      fetchMetas();
    }
  }, [empresaId]);

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

        {/* Comparativo mensal */}
        <ComparativoMensal transacoes={transacoes} />

        {/* Formulário para adicionar metas
        <MetaForm onSuccess={fetchMetas} empresaId={empresaId} /> */}

        {/* Visualização das metas cadastradas com barra de progresso */}
        {/* <MetasPorCategoria
          transacoes={transacoes}
          metas={metas}
          onUpdate={fetchMetas}
        /> */}
      </div>
    </Grid>
  );
}
