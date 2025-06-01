"use client";

import React, { useState } from "react";

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
  onEditado,
}: {
  transacao: Transacao;
  onDelete?: (id: number) => void;
  onEditado?: () => void; // callback para atualizar a tabela após edição
}) {
  const [editando, setEditando] = useState(false);
  const [editado, setEditado] = useState({ ...transacao });

  const salvar = async () => {
    const res = await fetch(`/api/transacoes/${transacao.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editado),
    });

    if (res.ok) {
      setEditando(false);
      onEditado?.(); // Atualiza a tabela após salvar
    } else {
      alert("Erro ao salvar alterações.");
    }
  };

  const cancelar = () => {
    setEditado({ ...transacao });
    setEditando(false);
  };

  return (
    <tr className="border-t">
      <td className="px-4 py-2">
        {editando ? (
          <input
            className="bg-white text-black p-1 rounded w-full"
            value={editado.titulo}
            onChange={(e) => setEditado({ ...editado, titulo: e.target.value })}
          />
        ) : (
          transacao.titulo
        )}
      </td>
      <td className="px-4 py-2">
        {editando ? (
          <select
            className="bg-white text-black p-1 rounded"
            value={editado.tipo}
            onChange={(e) =>
              setEditado({
                ...editado,
                tipo: e.target.value as "entrada" | "saida",
              })
            }
          >
            <option value="entrada">entrada</option>
            <option value="saida">saída</option>
          </select>
        ) : (
          <span
            className={
              transacao.tipo === "entrada" ? "text-green-600" : "text-red-500"
            }
          >
            {transacao.tipo}
          </span>
        )}
      </td>
      <td className="px-4 py-2">
        {editando ? (
          <input
            type="number"
            className="bg-white text-black p-1 rounded w-full"
            value={editado.valor}
            onChange={(e) =>
              setEditado({ ...editado, valor: parseFloat(e.target.value) })
            }
          />
        ) : (
          `R$ ${transacao.valor.toFixed(2).replace(".", ",")}`
        )}
      </td>
      <td className="px-4 py-2">
        {editando ? (
          <input
            type="date"
            className="bg-white text-black p-1 rounded"
            value={editado.data}
            onChange={(e) => setEditado({ ...editado, data: e.target.value })}
          />
        ) : (
          transacao.data
        )}
      </td>
      <td className="px-4 py-2">
        {editando ? (
          <input
            className="bg-white text-black p-1 rounded"
            value={editado.fornecedor}
            onChange={(e) =>
              setEditado({ ...editado, fornecedor: e.target.value })
            }
          />
        ) : (
          transacao.fornecedor
        )}
      </td>
      <td className="px-4 py-2">
        {editando ? (
          <input
            className="bg-white text-black p-1 rounded"
            value={editado.forma_pagamento}
            onChange={(e) =>
              setEditado({ ...editado, forma_pagamento: e.target.value })
            }
          />
        ) : (
          transacao.forma_pagamento
        )}
      </td>
      <td className="px-4 py-2">{transacao.categoria_nome}</td>
      <td className="px-4 py-2">{transacao.nicho_nome}</td>
      <td className="px-4 py-2">{transacao.banco}</td>
      <td className="px-4 py-2 space-x-2">
        {editando ? (
          <>
            <button onClick={salvar} className="text-green-600 hover:underline">
              Salvar
            </button>
            <button
              onClick={cancelar}
              className="text-gray-500 hover:underline"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditando(true)}
              className="text-blue-600 hover:underline"
            >
              Editar
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(transacao.id)}
                className="text-red-600 hover:underline"
              >
                Excluir
              </button>
            )}
          </>
        )}
      </td>
    </tr>
  );
}
