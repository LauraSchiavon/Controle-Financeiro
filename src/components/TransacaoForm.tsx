"use client";

import React, { useState } from "react";

export default function TransacaoForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  // Estados para os campos do formulário
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [data, setData] = useState("");

  // Novos estados para categoria e forma de pagamento
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [categoria, setCategoria] = useState("outros");

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/transacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        valor: parseFloat(valor),
        tipo,
        data,
        forma_pagamento: formaPagamento,
        categoria,
      }),
    });

    if (res.ok) {
      // Limpa os campos ao salvar
      setTitulo("");
      setValor("");
      setTipo("entrada");
      setData("");
      setFormaPagamento("pix");
      setCategoria("outros");
      onSuccess(); // Atualiza a lista
    } else {
      alert("Erro ao adicionar transação");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow mb-6"
    >
      {/* Campo: Título */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      {/* Campo: Valor */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">Valor (R$)</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      {/* Campo: Tipo */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">Tipo</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as "entrada" | "saida")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
      </div>

      {/* Campo: Data */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      {/* Campo: Forma de pagamento */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Forma de Pagamento
        </label>
        <select
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="pix">Pix</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
          <option value="dinheiro">Dinheiro</option>
        </select>
      </div>

      {/* Campo: Categoria */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">Categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="alimentacao">Alimentação</option>
          <option value="transporte">Transporte</option>
          <option value="moradia">Moradia</option>
          <option value="lazer">Lazer</option>
          <option value="salario">Salário</option>
          <option value="outros">Outros</option>
        </select>
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Adicionar Transação
      </button>
    </form>
  );
}
