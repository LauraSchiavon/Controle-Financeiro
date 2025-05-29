import React from "react";
import { Transacao } from "./TransacaoItem";

export default function TransacoesTable({
  transacoes,
  onDelete,
}: {
  transacoes: Transacao[];
  onDelete?: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Valor</th>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Forma</th>
            <th className="px-4 py-2">Categoria</th>
            {onDelete && <th className="px-4 py-2">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="px-4 py-2">{t.titulo}</td>
              <td
                className={`px-4 py-2 font-medium ${
                  t.tipo === "entrada" ? "text-green-600" : "text-red-500"
                }`}
              >
                {t.tipo}
              </td>
              <td className="px-4 py-2">
                R$ {t.valor.toFixed(2).replace(".", ",")}
              </td>
              <td className="px-4 py-2">{t.data}</td>
              <td className="px-4 py-2 capitalize">{t.forma_pagamento}</td>
              <td className="px-4 py-2 capitalize">{t.categoria}</td>
              {onDelete && (
                <td className="px-4 py-2">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Excluir
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
