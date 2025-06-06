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
    <div className="space-y-1">
      <label className="text-white text-sm font-medium">
        Cartão (opcional)
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f58723] transition"
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
