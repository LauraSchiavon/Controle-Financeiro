"use client";

import React, { useEffect, useState } from "react";
import CartaoSelector from "./CartaoSelector";

interface Categoria {
  id: number;
  nome: string;
  tipo: string;
  nicho_id: number;
  nicho_nome?: string;
}

interface Nicho {
  id: number;
  nome: string;
  tipo: string;
  empresa_id: number;
}

export default function TransacaoForm({
  onSuccess,
  empresaId,
}: {
  onSuccess: () => void;
  empresaId: number;
}) {
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [data, setData] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [nichoId, setNichoId] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [cartaoId, setCartaoId] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nichos, setNichos] = useState<Nicho[]>([]);

  useEffect(() => {
    if (!empresaId || !tipo) return;
    fetch(`/api/empresas/${empresaId}/categorias?tipo=${tipo}`)
      .then((res) => res.json())
      .then((data: Categoria[]) => setCategorias(data));
  }, [empresaId, tipo]);

  useEffect(() => {
    if (!empresaId || !categoriaId) return;
    fetch(`/api/empresas/${empresaId}/nichos`)
      .then((res) => res.json())
      .then((data: Nicho[]) => {
        const cat = categorias.find((c) => c.id === Number(categoriaId));
        const filtrados = data.filter((n: Nicho) => n.id === cat?.nicho_id);
        setNichos(filtrados);
      });
  }, [empresaId, categoriaId, categorias]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !titulo ||
      !valor ||
      !tipo ||
      !data ||
      !categoriaId ||
      !formaPagamento ||
      !fornecedor
    )
      return;

    await fetch(`/api/empresas/${empresaId}/transacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        valor: Number(valor),
        tipo,
        data,
        fornecedor,
        categoria_id: Number(categoriaId),
        nicho_id: nichoId ? Number(nichoId) : null,
        forma_pagamento: formaPagamento,
        cartao_id: cartaoId ? Number(cartaoId) : null,
        empresa_id: empresaId,
      }),
    });

    setTitulo("");
    setValor("");
    setTipo("saida");
    setData("");
    setFornecedor("");
    setCategoriaId("");
    setNichoId("");
    setFormaPagamento("");
    setCartaoId("");
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 bg-gradient-to-br from-[#0d0d0d] to-[#1c1c1c] p-6 rounded-2xl shadow-2xl border border-white/10 backdrop-blur"
    >
      <h2 className="text-2xl font-semibold text-white">Nova Transação</h2>

      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        className="w-full bg-white/5 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        required
        className="w-full bg-white/5 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          className="w-full bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          className="w-full bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
        />
      </div>

      <input
        placeholder="Fornecedor"
        value={fornecedor}
        onChange={(e) => setFornecedor(e.target.value)}
        required
        className="w-full bg-white/5 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
      />

      <select
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
        disabled={!tipo}
        className={`w-full bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f58723] transition-opacity ${
          !tipo ? "opacity-50" : "opacity-100"
        }`}
      >
        <option value="">Categoria</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nicho_nome} → {c.nome}
          </option>
        ))}
      </select>

      <select
        value={nichoId}
        onChange={(e) => setNichoId(e.target.value)}
        disabled={!categoriaId}
        className={`w-full bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f58723] transition-opacity ${
          !categoriaId ? "opacity-50" : "opacity-100"
        }`}
      >
        <option value="">Subcategoria</option>
        {nichos.map((n) => (
          <option key={n.id} value={n.id}>
            {n.nome}
          </option>
        ))}
      </select>

      <select
        value={formaPagamento}
        onChange={(e) => setFormaPagamento(e.target.value)}
        required
        className="w-full bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
      >
        <option value="">Forma de Pagamento</option>
        <option value="pix">Pix</option>
        <option value="debito">Débito</option>
        <option value="credito">Crédito</option>
        <option value="dinheiro">Dinheiro</option>
      </select>

      <CartaoSelector
        selected={cartaoId}
        onChange={setCartaoId}
        empresaId={empresaId}
      />

      <button
        type="submit"
        className="w-full bg-[#f58723] hover:bg-[#f58723] text-white font-medium py-3 rounded-xl transition-all duration-200"
      >
        Salvar Transação
      </button>
    </form>
  );
}
