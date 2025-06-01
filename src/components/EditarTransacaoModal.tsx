// src/components/EditarTransacaoModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Transacao } from "./TransacaoItem";

interface EditarTransacaoModalProps {
  transacao: Transacao;
  onClose: () => void;
  onSalvo: () => void;
}

export default function EditarTransacaoModal({
  transacao,
  onClose,
  onSalvo,
}: EditarTransacaoModalProps) {
  const [form, setForm] = useState({ ...transacao });
  const [carregando, setCarregando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const salvar = async () => {
    setCarregando(true);
    const res = await fetch(`/api/transacoes/${transacao.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSalvo();
      onClose();
    } else {
      alert("Erro ao atualizar transação");
    }
    setCarregando(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl animate-fade-in">
        <h2 className="text-xl font-bold mb-4">Editar Transação</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Título"
            className="border p-2 rounded"
          />
          <input
            name="valor"
            value={form.valor}
            onChange={handleChange}
            placeholder="Valor"
            type="number"
            className="border p-2 rounded"
          />
          <input
            name="data"
            value={form.data}
            onChange={handleChange}
            type="date"
            className="border p-2 rounded"
          />
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          <input
            name="fornecedor"
            value={form.fornecedor}
            onChange={handleChange}
            placeholder="Fornecedor"
            className="border p-2 rounded"
          />
          <input
            name="forma_pagamento"
            value={form.forma_pagamento}
            onChange={handleChange}
            placeholder="Forma de Pagamento"
            className="border p-2 rounded"
          />
          <input
            name="categoria_nome"
            value={form.categoria_nome}
            onChange={handleChange}
            placeholder="Categoria"
            className="border p-2 rounded"
          />
          <input
            name="nicho_nome"
            value={form.nicho_nome}
            onChange={handleChange}
            placeholder="Nicho"
            className="border p-2 rounded"
          />
          <input
            name="banco"
            value={form.banco}
            onChange={handleChange}
            placeholder="Cartão (Banco)"
            className="border p-2 rounded"
          />
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={carregando}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {carregando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
