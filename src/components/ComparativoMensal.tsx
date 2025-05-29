"use client";

import React, { useState } from "react";
import { Transacao } from "./TransacaoItem";

// Lista de meses para exibir no select
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

export default function ComparativoMensal({
  transacoes,
}: {
  transacoes: Transacao[];
}) {
  // Estados para o primeiro período (mês/ano)
  const [mes1, setMes1] = useState(new Date().getMonth() + 1); // mês atual
  const [ano1, setAno1] = useState(new Date().getFullYear());

  // Estados para o segundo período (mês/ano)
  const [mes2, setMes2] = useState(new Date().getMonth()); // mês anterior
  const [ano2, setAno2] = useState(
    new Date().getMonth() === 0
      ? new Date().getFullYear() - 1
      : new Date().getFullYear()
  );

  // Filtra as transações tipo "saida"
  const saidas = transacoes.filter((t) => t.tipo === "saida");

  // Função que calcula o total de gastos em um mês específico
  const totalPorMes = (mes: number, ano: number) => {
    return saidas.reduce((total, t) => {
      const data = new Date(t.data);
      const tMes = data.getMonth() + 1;
      const tAno = data.getFullYear();
      return tMes === mes && tAno === ano ? total + t.valor : total;
    }, 0);
  };

  const total1 = totalPorMes(mes1, ano1);
  const total2 = totalPorMes(mes2, ano2);

  // Cálculo da diferença percentual
  const diferenca = total2
    ? (((total1 - total2) / total2) * 100).toFixed(1)
    : "0";
  const aumento = parseFloat(diferenca) > 0;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Comparativo entre Períodos
      </h2>

      {/* Seletor dos dois períodos */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Período 1 */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Período 1 - Mês
          </label>
          <select
            value={mes1}
            onChange={(e) => setMes1(Number(e.target.value))}
            className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {MESES.map((mes, index) => (
              <option key={index} value={index + 1}>
                {mes}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Período 1 - Ano
          </label>
          <input
            type="number"
            value={ano1}
            onChange={(e) => setAno1(Number(e.target.value))}
            className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Período 2 */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Período 2 - Mês
          </label>
          <select
            value={mes2}
            onChange={(e) => setMes2(Number(e.target.value))}
            className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {MESES.map((mes, index) => (
              <option key={index} value={index + 1}>
                {mes}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Período 2 - Ano
          </label>
          <input
            type="number"
            value={ano2}
            onChange={(e) => setAno2(Number(e.target.value))}
            className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Resultado do comparativo */}
      <p className="text-gray-700 dark:text-gray-300">
        {total2 > 0 ? (
          <>
            Em {MESES[mes1 - 1]} de {ano1}, você{" "}
            {aumento ? "gastou mais" : "gastou menos"} do que em{" "}
            {MESES[mes2 - 1]} de {ano2}:{" "}
            <span className={aumento ? "text-red-600" : "text-green-600"}>
              {aumento ? "+" : "-"}
              {diferenca}%
            </span>
          </>
        ) : (
          "Sem dados suficientes para comparar."
        )}
      </p>
    </div>
  );
}
