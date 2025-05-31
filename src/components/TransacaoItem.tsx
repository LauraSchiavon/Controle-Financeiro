// src/components/TransacaoItem.tsx
import React from "react";

export interface Transacao {
  id: number;
  titulo: string;
  valor: number;
  tipo: "entrada" | "saida";
  data: string;
  fornecedor: string;
  forma_pagamento: string;
  categoria_nome: string;
  nicho_nome: string;
  banco: string;
}

export default function TransacaoItem({
  transacao,
  onDelete,
}: {
  transacao: Transacao;
  onDelete?: (id: number) => void;
}) {
  return (
    <tr className="border-t">
      <td className="px-4 py-2">{transacao.titulo}</td>
      <td
        className={`px-4 py-2 font-medium ${
          transacao.tipo === "entrada" ? "text-green-600" : "text-red-500"
        }`}
      >
        {transacao.tipo}
      </td>
      <td className="px-4 py-2">
        R$ {transacao.valor.toFixed(2).replace(".", ",")}
      </td>
      <td className="px-4 py-2">{transacao.data}</td>
      <td className="px-4 py-2 capitalize">{transacao.fornecedor}</td>
      <td className="px-4 py-2 capitalize">{transacao.forma_pagamento}</td>
      <td className="px-4 py-2 capitalize">{transacao.categoria_nome}</td>
      <td className="px-4 py-2 capitalize">{transacao.nicho_nome}</td>
      <td className="px-4 py-2 capitalize">{transacao.banco}</td>
      {onDelete && (
        <td className="px-4 py-2">
          <button
            onClick={() => onDelete(transacao.id)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Excluir
          </button>
        </td>
      )}
    </tr>
  );
}
