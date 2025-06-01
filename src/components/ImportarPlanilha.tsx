"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

const mapaColunas: Record<string, string> = {
  titulo: "titulo",
  título: "titulo",
  Titulo: "titulo",
  TÍTULO: "titulo",
  valor: "valor",
  Valor: "valor",
  VALOR: "valor",
  data: "data",
  DATA: "data",
  tipo: "tipo",
  TIPO: "tipo",
  fornecedor: "fornecedor",
  FORNECEDOR: "fornecedor",
  "forma de pagamento": "forma_pagamento",
  forma_pagamento: "forma_pagamento",
  categoria: "categoria",
  CATEGORIA: "categoria",
  nicho: "nicho",
  NICHO: "nicho",
  cartao: "cartao",
  cartão: "cartao",
  CARTAO: "cartao",
  CARTÃO: "cartao",
};

function limparTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_"); // espaço para underline
}

export default function ImportarPlanilha({
  onImportar,
}: {
  onImportar: (dados: any[]) => void;
}) {
  const [erros, setErros] = useState<string[]>([]);

  const handleArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      const dadosValidados = rawJson.map(
        (linhaOriginal: any, index: number) => {
          const linha: any = {};
          const errosLinha: string[] = [];

          // Normaliza os nomes das colunas
          for (const chaveOriginal in linhaOriginal) {
            const chaveLimpa = limparTexto(chaveOriginal);
            const nomePadrao =
              mapaColunas[chaveOriginal] ||
              mapaColunas[chaveLimpa] ||
              chaveLimpa;
            linha[nomePadrao] = linhaOriginal[chaveOriginal];
          }

          // Verificação de campos obrigatórios
          if (!linha.titulo) errosLinha.push("titulo");
          // ✅ Normaliza o valor para float
          if (linha.valor) {
            const valorLimpo = String(linha.valor)
              .replace("R$", "")
              .replace(/\./g, "") // remove ponto de milhar
              .replace(",", ".")
              .replace(/\s/g, ""); // remove espaços

            linha.valor = parseFloat(valorLimpo);

            if (isNaN(linha.valor)) errosLinha.push("valor");
          } else {
            errosLinha.push("valor");
          }

          if (!linha.data) errosLinha.push("data");

          linha._erros = errosLinha;
          linha._index = index + 2; // linha real no Excel (header + base 1)

          return linha;
        }
      );

      const errosTotais = dadosValidados.filter((l) => l._erros.length > 0);
      setErros(
        errosTotais.map((l) => `Linha ${l._index}: ${l._erros.join(", ")}`)
      );

      onImportar(dadosValidados);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleArquivo}
        className="mb-2"
      />
      {erros.length > 0 && (
        <div className="text-red-500 text-sm space-y-1">
          <p>❗ Campos obrigatórios ausentes ou inválidos:</p>
          <ul className="list-disc ml-6">
            {erros.map((erro, idx) => (
              <li key={idx}>{erro}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
