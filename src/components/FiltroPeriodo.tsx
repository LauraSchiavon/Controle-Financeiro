"use client";

import React from "react";

// Lista de meses disponíveis (poderia ser gerado dinâmico também)
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Ano atual e anteriores (para selecionar)
const ANOS = [2023, 2024, 2025];

export default function FiltroPeriodo({
  mesSelecionado,
  anoSelecionado,
  onChange,
}: {
  mesSelecionado: number;
  anoSelecionado: number;
  onChange: (mes: number, ano: number) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 flex gap-4 items-center">
      {/* Seletor de mês */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
          Mês
        </label>
        <select
          value={mesSelecionado}
          onChange={(e) => onChange(Number(e.target.value), anoSelecionado)}
          className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {MESES.map((mes, index) => (
            <option key={index} value={index + 1}>
              {mes}
            </option>
          ))}
        </select>
      </div>

      {/* Seletor de ano */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
          Ano
        </label>
        <select
          value={anoSelecionado}
          onChange={(e) => onChange(mesSelecionado, Number(e.target.value))}
          className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {ANOS.map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
