"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";
import { Transacao } from "./TransacaoItem";
import { motion } from "framer-motion";

const cores = [
  "#4f46e5",
  "#ec4899",
  "#10b981",
  "#facc15",
  "#f97316",
  "#22d3ee",
];

export default function ResumoGraficos({
  transacoes,
}: {
  transacoes: Transacao[];
}) {
  const entradas = transacoes.filter((t) => t.tipo === "entrada");
  const saidas = transacoes.filter((t) => t.tipo === "saida");

  // Função para agrupar por chave (ex: categoria_nome ou forma_pagamento)
  const agrupar = (dados: Transacao[], chave: keyof Transacao) => {
    const agrupado: { [key: string]: number } = {};
    dados.forEach((t) => {
      const key = t[chave] as string;
      if (key) agrupado[key] = (agrupado[key] || 0) + t.valor;
    });
    return Object.entries(agrupado).map(([nome, valor]) => ({ nome, valor }));
  };

  const entradasPorCategoria = agrupar(entradas, "categoria_nome");
  const saidasPorCategoria = agrupar(saidas, "categoria_nome");

  const entradasPorForma = agrupar(entradas, "forma_pagamento");
  const saidasPorForma = agrupar(saidas, "forma_pagamento");

  const GraficoPizza = ({
    titulo,
    dados,
  }: {
    titulo: string;
    dados: { nome: string; valor: number }[];
  }) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {titulo}
      </h2>
      <ResponsiveContainer width="100%" height={290}>
        <PieChart>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="nome"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {dados.map((_, index) => (
              <Cell key={index} fill={cores[index % cores.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const GraficoBarra = ({
    titulo,
    dados,
  }: {
    titulo: string;
    dados: { nome: string; valor: number }[];
  }) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {titulo}
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" tick={{ fill: "#a3a3a3" }} />
          <YAxis tick={{ fill: "#a3a3a3" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="valor" fill="#4f46e5">
            <LabelList dataKey="valor" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
    >
      <GraficoPizza
        titulo="Entradas por Categoria"
        dados={entradasPorCategoria}
      />
      <GraficoPizza titulo="Saídas por Categoria" dados={saidasPorCategoria} />
      <GraficoBarra
        titulo="Entradas por Forma de Pagamento"
        dados={entradasPorForma}
      />
      <GraficoBarra
        titulo="Saídas por Forma de Pagamento"
        dados={saidasPorForma}
      />
    </motion.div>
  );
}
