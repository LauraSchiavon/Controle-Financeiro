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

// Paleta de cores para os gráficos
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
  const saidas = transacoes.filter((t) => t.tipo === "saida");

  const porCategoria: { [key: string]: number } = {};
  saidas.forEach((t) => {
    porCategoria[t.categoria] = (porCategoria[t.categoria] || 0) + t.valor;
  });
  const dadosCategoria = Object.entries(porCategoria).map(([nome, valor]) => ({
    nome,
    valor,
  }));

  const porForma: { [key: string]: number } = {};
  saidas.forEach((t) => {
    porForma[t.forma_pagamento] = (porForma[t.forma_pagamento] || 0) + t.valor;
  });
  const dadosForma = Object.entries(porForma).map(([nome, valor]) => ({
    nome,
    valor,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
    >
      {/* Gráfico de pizza por categoria */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 transition-all">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Gastos por Categoria
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dadosCategoria}
              dataKey="valor"
              nameKey="nome"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {dadosCategoria.map((_, index) => (
                <Cell key={index} fill={cores[index % cores.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de barras por forma de pagamento */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 transition-all">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Gastos por Forma de Pagamento
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dadosForma}>
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
    </motion.div>
  );
}
