import { useEffect, useState } from "react";

interface Cartao {
  id: number;
  banco: string;
  final: string;
}

export default function CartaoSelector({
  selected,
  onChange,
  empresaId,
}: {
  selected: string;
  onChange: (value: string) => void;
  empresaId: number | null;
}) {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);

  useEffect(() => {
    if (typeof empresaId !== "number") return;

    fetch(`/api/empresas/${empresaId}/cartoes`)
      .then((res) => res.json())
      .then(setCartoes);
  }, [empresaId]);

  return (
    <div>
      <label className="block text-white mb-1">Cartão (opcional)</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
      >
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
