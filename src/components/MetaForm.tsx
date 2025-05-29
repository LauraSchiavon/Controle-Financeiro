"use client";

import React, { useState } from "react";

// Categorias disponíveis no select
const CATEGORIAS = [
  "alimentacao",
  "transporte",
  "lazer",
  "moradia",
  "educacao",
  "saude",
];

export default function MetaForm({ onSuccess }: { onSuccess: () => void }) {
  // Estado para exibir/esconder o formulário
  const [showForm, setShowForm] = useState(false);

  // Estados para os campos do formulário
  const [categoria, setCategoria] = useState("");
  const [limite, setLimite] = useState("");

  // Estado para mostrar mensagem de erro caso a categoria já exista
  const [erro, setErro] = useState("");

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se algum campo estiver vazio, não continua
    if (!categoria || !limite) return;

    // Envia a requisição para a API
    const res = await fetch("/api/metas", {
      method: "POST",
      body: JSON.stringify({ categoria, limite: Number(limite) }),
    });

    // Se a resposta for erro (categoria duplicada, por exemplo)
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error || "Erro ao criar meta");
      return;
    }

    // Se deu certo, limpa os campos e fecha o formulário
    setErro("");
    setCategoria("");
    setLimite("");
    setShowForm(false);
    onSuccess(); // Atualiza a lista de metas
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
      {/* Botão que mostra ou esconde o formulário */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition"
        >
          Nova Meta
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select de categoria */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Categoria
            </label>
            <select
              className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de limite */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
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

          {/* Mostra mensagem de erro caso exista */}
          {erro && <p className="text-red-500 text-sm mt-1">⚠ {erro}</p>}

          {/* Botões de ação */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setErro("");
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
