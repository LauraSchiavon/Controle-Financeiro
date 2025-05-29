// src/components/CartaoForm.tsx
"use client";

import React, { useState } from "react";

export default function CartaoForm({ onSuccess }: { onSuccess: () => void }) {
  const [banco, setBanco] = useState("");
  const [final, setFinal] = useState("");
  const [limite, setLimite] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/cartoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banco, final, limite: Number(limite) }),
    });

    setBanco("");
    setFinal("");
    setLimite("");
    onSuccess(); // Atualiza a lista
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        placeholder="Banco"
        value={banco}
        onChange={(e) => setBanco(e.target.value)}
        required
      />
      <input
        placeholder="Final do Cartão"
        value={final}
        onChange={(e) => setFinal(e.target.value)}
        required
      />
      <input
        placeholder="Limite (R$)"
        type="number"
        value={limite}
        onChange={(e) => setLimite(e.target.value)}
        required
      />
      <button type="submit">Salvar Cartão</button>
    </form>
  );
}
