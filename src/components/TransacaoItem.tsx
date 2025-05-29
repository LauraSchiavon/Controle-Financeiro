// src/components/TransacaoItem.tsx
import React from "react";

// Tipo da transação (reaproveitamos aqui)
export interface Transacao {
  id: number;
  titulo: string;
  valor: number;
  tipo: "entrada" | "saida";
  data: string;
  forma_pagamento: string;
  categoria: string;
  banco: string;
}
// Componente que representa uma linha da tabela
export default function TransacaoItem({ transacao }: { transacao: Transacao }) {
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
      <td className="px-4 py-2 capitalize">{transacao.forma_pagamento}</td>
      <td className="px-4 py-2 capitalize">{transacao.categoria}</td>
      <td className="px-4 py-2 capitalize">{transacao.banco}</td>
    </tr>
  );
}
