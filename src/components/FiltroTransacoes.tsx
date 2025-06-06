"use client";

import React, { useEffect, useState } from "react";
import Grid from "@/components/Grid";

interface Filtros {
  titulo?: string;
  tipo?: string;
  forma_pagamento?: string;
  categoria?: string;
  nicho?: string;
  cartao?: string;
  fornecedor?: string;
  valor?: string;
  data?: string;
  empresaId: number;
}

export default function FiltroTransacoes({
  filtros,
  onChange,
}: {
  filtros: Filtros;
  onChange: (novosFiltros: Filtros) => void;
}) {
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!filtros.tipo || !filtros.empresaId) return;

      const res = await fetch(
        `/api/empresas/${filtros.empresaId}/categorias?tipo=${filtros.tipo}`
      );
      const data = await res.json();
      setCategorias(data || []);
    };

    fetchCategorias();
  }, [filtros.tipo, filtros.empresaId]);

  return (
    <Grid>
      <div className="bg-[#0f0f0f] border border-[#333] p-6 rounded-2xl shadow-xl mb-6 w-full">
        <h2 className="text-xl font-semibold text-[#f1ecdf] mb-4">
          Filtros de Transação
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por título"
            value={filtros.titulo || ""}
            onChange={(e) => onChange({ ...filtros, titulo: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] text-white border border-[#555] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
          />

          <select
            value={filtros.tipo || ""}
            onChange={(e) => onChange({ ...filtros, tipo: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#f58723]"
          >
            <option value="">Todos os tipos</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>

          <select
            value={filtros.forma_pagamento || ""}
            onChange={(e) =>
              onChange({ ...filtros, forma_pagamento: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#f58723]"
          >
            <option value="">Todas as formas</option>
            <option value="pix">Pix</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
            <option value="dinheiro">Dinheiro</option>
          </select>

          <select
            value={filtros.categoria || ""}
            onChange={(e) =>
              onChange({ ...filtros, categoria: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#f58723]"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nome}>
                {cat.nome}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Nicho"
            value={filtros.nicho || ""}
            onChange={(e) => onChange({ ...filtros, nicho: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] text-white border border-[#555] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
          />

          <input
            type="text"
            placeholder="Cartão"
            value={filtros.cartao || ""}
            onChange={(e) => onChange({ ...filtros, cartao: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] text-white border border-[#555] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
          />

          <input
            type="text"
            placeholder="Fornecedor"
            value={filtros.fornecedor || ""}
            onChange={(e) =>
              onChange({ ...filtros, fornecedor: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] text-white border border-[#555] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
          />

          <input
            type="number"
            placeholder="Valor exato"
            value={filtros.valor || ""}
            onChange={(e) => onChange({ ...filtros, valor: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] text-white border border-[#555] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f58723]"
          />

          <input
            type="date"
            value={filtros.data || ""}
            onChange={(e) => onChange({ ...filtros, data: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#f58723]"
          />
        </div>
      </div>
    </Grid>
  );
}
