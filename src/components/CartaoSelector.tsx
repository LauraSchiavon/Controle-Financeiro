// src/components/CartaoSelector.tsx
"use client";

import { useEffect, useState } from "react";

interface Cartao {
  id: number;
  banco: string;
  final: string;
}

export default function CartaoSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (value: string) => void;
}) {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);

  useEffect(() => {
    fetch("/api/cartoes")
      .then((res) => res.json())
      .then((data) => setCartoes(data));
  }, []);

  return (
    <div>
      <label>Cartão (opcional)</label>
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">Nenhum</option>
        {cartoes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.banco} - Final {c.final}
          </option>
        ))}
      </select>
    </div>
  );
}
