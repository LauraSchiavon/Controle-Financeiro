"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";
import Link from "next/link";

// Tipagem do cartão
interface Cartao {
  id: number;
  banco: string;
  final: string;
  limite: number;
}

export default function InformacoesPage() {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [banco, setBanco] = useState("");
  const [final, setFinal] = useState("");
  const [limite, setLimite] = useState("");

  // Buscar cartões do banco (API)
  const fetchCartoes = async () => {
    const res = await fetch("/api/cartoes");
    const data = await res.json();
    setCartoes(data);
  };

  useEffect(() => {
    fetchCartoes();
  }, []);

  // Adiciona novo cartão via API
  const adicionarCartao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banco || !final || !limite) return;

    await fetch("/api/cartoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        banco,
        final,
        limite: Number(limite),
      }),
    });

    setBanco("");
    setFinal("");
    setLimite("");
    fetchCartoes();
  };

  // Exclui cartão via API
  const excluirCartao = async (id: number) => {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir este cartão?"
    );
    if (!confirm) return;

    await fetch(`/api/cartoes/${id}`, {
      method: "DELETE",
    });

    fetchCartoes();
  };

  return (
    <Grid>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Informações do Usuário & Cartões
        </h1>

        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            ← Voltar para Dashboard
          </Link>
        </div>

        {/* Formulário */}
        <form
          onSubmit={adicionarCartao}
          className="space-y-4 bg-white dark:bg-gray-900 p-4 rounded shadow mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Adicionar Cartão
          </h2>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Banco
            </label>
            <input
              value={banco}
              onChange={(e) => setBanco(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Final do Cartão
            </label>
            <input
              value={final}
              onChange={(e) => setFinal(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Limite (R$)
            </label>
            <input
              type="number"
              value={limite}
              onChange={(e) => setLimite(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Salvar Cartão
          </button>
        </form>

        {/* Lista de Cartões */}
        <div className="space-y-4">
          {cartoes.map((c) => (
            <div
              key={c.id}
              className="bg-gray-100 dark:bg-gray-800 rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-700 dark:text-white font-medium">
                  <strong>{c.banco}</strong> - final {c.final}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Limite: R$ {c.limite.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <button
                onClick={() => excluirCartao(c.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      </div>
    </Grid>
  );
}
