// src/components/TransacaoForm.tsx
"use client";

import React, { useState } from "react";
import CartaoSelector from "./CartaoSelector";

export default function TransacaoForm({
  onSuccess,
  empresaId,
}: {
  onSuccess: () => void;
  empresaId: number; // 👈 adicione isso
}) {
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [cartaoId, setCartaoId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !valor || !tipo || !data || !categoria || !formaPagamento)
      return;

    await fetch(`/api/empresas/${empresaId}/transacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        valor: Number(valor),
        tipo,
        data,
        categoria,
        forma_pagamento: formaPagamento,
        cartao_id: cartaoId ? Number(cartaoId) : null,
      }),
    });

    setTitulo("");
    setValor("");
    setTipo("saida");
    setData("");
    setCategoria("");
    setFormaPagamento("");
    setCartaoId("");
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] p-6 rounded-2xl shadow-xl border border-gray-700 mb-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Nova Transação</h2>

      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
        />
      </div>

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
      >
        <option value="">Categoria</option>
        <option value="alimentacao">Alimentação</option>
        <option value="transporte">Transporte</option>
        <option value="moradia">Moradia</option>
        <option value="lazer">Lazer</option>
        <option value="salario">Salário</option>
        <option value="outros">Outros</option>
      </select>

      <select
        value={formaPagamento}
        onChange={(e) => setFormaPagamento(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
      >
        <option value="">Forma de Pagamento</option>
        <option value="pix">Pix</option>
        <option value="debito">Débito</option>
        <option value="credito">Crédito</option>
        <option value="dinheiro">Dinheiro</option>
      </select>

      {/* Seletor de Cartão */}
      <CartaoSelector selected={cartaoId} onChange={setCartaoId} />

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
      >
        Salvar Transação
      </button>
    </form>
  );
}
