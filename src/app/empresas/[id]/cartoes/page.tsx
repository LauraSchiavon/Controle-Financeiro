"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";
import { useParams } from "next/navigation";

interface Cartao {
  id: number;
  banco: string;
  final: string;
  limite: number;
}

export default function CartoesPage() {
  const { id } = useParams(); // empresaId pela URL
  const empresaId = Number(id);

  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [banco, setBanco] = useState("");
  const [final, setFinal] = useState("");
  const [limite, setLimite] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const fetchCartoes = () => {
    fetch(`/api/empresas/${empresaId}/cartoes`)
      .then((res) => res.json())
      .then(setCartoes);
  };

  useEffect(() => {
    if (empresaId) fetchCartoes();
  }, [empresaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { banco, final, limite: Number(limite) };

    if (editandoId) {
      await fetch(`/api/empresas/${empresaId}/cartoes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          id: editandoId,
          empresa_id: empresaId,
        }),
      });
    } else {
      const res = await fetch(`/api/empresas/${empresaId}/cartoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banco, final, limite, empresaId }),
      });

      if (res.status === 409) {
        alert("Este cartão já está cadastrado.");
        return;
      }
    }

    setBanco("");
    setFinal("");
    setLimite("");
    setEditandoId(null);
    fetchCartoes();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este cartão?")) {
      await fetch(`/api/empresas/${empresaId}/cartoes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, empresaId }),
      });
      fetchCartoes();
    }
  };

  const iniciarEdicao = (cartao: Cartao) => {
    setEditandoId(cartao.id);
    setBanco(cartao.banco);
    setFinal(cartao.final);
    setLimite(cartao.limite.toString());
  };

  return (
    <Grid>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-6">Cartões da Empresa</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-gray-900 p-4 rounded shadow mb-6"
        >
          <h2 className="text-lg font-semibold">
            {editandoId ? "Editar Cartão" : "Adicionar Cartão"}
          </h2>

          <input
            placeholder="Banco"
            value={banco}
            onChange={(e) => setBanco(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border"
          />
          <input
            placeholder="Final do cartão"
            value={final}
            onChange={(e) => setFinal(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border"
          />
          <input
            placeholder="Limite (R$)"
            value={limite}
            type="number"
            onChange={(e) => setLimite(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border"
          />

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            {editandoId ? "Salvar Alterações" : "Salvar Cartão"}
          </button>
        </form>

        <div className="space-y-4">
          {cartoes.map((cartao) => (
            <div
              key={cartao.id}
              className="bg-gray-100 dark:bg-gray-800 rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {cartao.banco} - Final {cartao.final}
                </p>
                <p className="text-sm text-gray-500">
                  Limite: R$ {cartao.limite.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => iniciarEdicao(cartao)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cartao.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Grid>
  );
}
