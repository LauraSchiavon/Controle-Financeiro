"use client";

import React from "react";

// Tipos de filtros que vamos controlar
interface Filtros {
  titulo?: string;
  tipo?: string;
  forma_pagamento?: string;
  categoria?: string;
  data?: string;
}

// Props: recebe os filtros e uma função para atualizar
export default function FiltroTransacoes({
  filtros,
  onChange,
}: {
  filtros: Filtros;
  onChange: (novosFiltros: Filtros) => void;
}) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6 space-y-3">
      <h2 className="text-lg font-semibold">Filtros</h2>

      {/* Filtro por título */}
      <input
        type="text"
        placeholder="Buscar por título"
        value={filtros.titulo || ""}
        onChange={(e) => onChange({ ...filtros, titulo: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />

      {/* Filtro por tipo */}
      <select
        value={filtros.tipo || ""}
        onChange={(e) => onChange({ ...filtros, tipo: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Todos os tipos</option>
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      {/* Filtro por forma de pagamento */}
      <select
        value={filtros.forma_pagamento || ""}
        onChange={(e) =>
          onChange({ ...filtros, forma_pagamento: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Todas as formas</option>
        <option value="pix">Pix</option>
        <option value="debito">Débito</option>
        <option value="credito">Crédito</option>
        <option value="dinheiro">Dinheiro</option>
      </select>

      {/* Filtro por categoria */}
      <select
        value={filtros.categoria || ""}
        onChange={(e) => onChange({ ...filtros, categoria: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Todas as categorias</option>
        <option value="alimentacao">Alimentação</option>
        <option value="transporte">Transporte</option>
        <option value="moradia">Moradia</option>
        <option value="lazer">Lazer</option>
        <option value="salario">Salário</option>
        <option value="outros">Outros</option>
      </select>

      {/* Filtro por data */}
      <input
        type="date"
        value={filtros.data || ""}
        onChange={(e) => onChange({ ...filtros, data: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
}
