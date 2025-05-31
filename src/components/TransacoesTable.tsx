// src/components/TransacoesTable.tsx
import React from "react";
import TransacaoItem, { Transacao } from "./TransacaoItem";

export default function TransacoesTable({
  transacoes,
  onDelete,
}: {
  transacoes: Transacao[];
  onDelete?: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto bg-gray-700 rounded shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Valor</th>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Fornecedor</th>
            <th className="px-4 py-2">Forma</th>
            <th className="px-4 py-2">Categoria</th>
            <th className="px-4 py-2">Nicho</th>
            <th className="px-4 py-2">Cartão</th>
            {onDelete && <th className="px-4 py-2">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <TransacaoItem key={t.id} transacao={t} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
