"use client";

import React from "react";
import { Transacao } from "./TransacaoItem";
import { saveAs } from "file-saver";

export default function ExportarRelatorio({
  transacoes,
}: {
  transacoes: Transacao[];
}) {
  // Exporta para CSV
  const exportarCSV = () => {
    // Cabeçalho
    const cabecalho = "Titulo;Valor;Tipo;Data;Categoria;Forma de Pagamento\n";

    // Conteúdo das linhas
    const linhas = transacoes.map((t) => {
      return `"${t.titulo}";"R$ ${t.valor.toFixed(2).replace(".", ",")}";"${
        t.tipo
      }";"${t.data}";"${t.categoria}";"${t.forma_pagamento}"`;
    });
    // Junta tudo e transforma em Blob
    const csv = cabecalho + linhas.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    // Faz o download do arquivo
    saveAs(blob, "relatorio.csv");
  };

  return (
    <div className="mb-6">
      <button
        onClick={exportarCSV}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Exportar Relatório (CSV)
      </button>
    </div>
  );
}
