"use client";

import React from "react";
import { Transacao } from "./TransacaoItem";

// Componente que exibe as metas por categoria
export default function MetasPorCategoria({
  transacoes,
  metas,
  onUpdate, // Função para atualizar a lista após exclusão
}: {
  transacoes: Transacao[];
  metas: { categoria: string; limite: number; id: number }[];
  onUpdate: () => void;
}) {
  // Filtra apenas transações do tipo "saida" (gastos)
  const saidas = transacoes.filter((t) => t.tipo === "saida");

  // Soma os gastos por categoria
  const gastosPorCategoria: { [key: string]: number } = {};
  saidas.forEach((t) => {
    gastosPorCategoria[t.categoria] =
      (gastosPorCategoria[t.categoria] || 0) + t.valor;
  });

  // Função que chama a API para excluir uma meta
  const handleExcluir = async (id: number) => {
    await fetch(`/api/metas?id=${id}`, {
      method: "DELETE",
    });

    // Atualiza a lista de metas depois de excluir
    onUpdate();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded shadow p-6 mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Metas por Categoria
      </h2>

      <div className="space-y-5">
        {/* Para cada meta, mostramos o progresso de gasto */}
        {metas.map((meta) => {
          const gasto = gastosPorCategoria[meta.categoria] || 0;
          const porcentagem = Math.min((gasto / meta.limite) * 100, 100);
          const passou = gasto > meta.limite;

          return (
            <div key={meta.id} className="mb-4">
              <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 mb-1">
                <span className="capitalize">{meta.categoria}</span>
                <div className="flex items-center gap-2">
                  <span>
                    R$ {gasto.toFixed(2).replace(".", ",")} / R${" "}
                    {meta.limite.toFixed(2).replace(".", ",")}
                  </span>
                  {/* Botão para excluir a meta */}
                  <button
                    onClick={() => handleExcluir(meta.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                    title="Excluir meta"
                  >
                    ✖
                  </button>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded">
                <div
                  className={`h-full rounded transition-all duration-500 ${
                    passou ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${porcentagem}%` }}
                ></div>
              </div>

              {/* Mensagem de aviso se passou o limite */}
              {passou && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  ⚠ Você ultrapassou o limite dessa categoria!
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
