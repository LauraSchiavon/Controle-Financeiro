import React, { useState } from "react";
import ImportarPlanilha from "./ImportarPlanilha";

interface LinhaImportada {
  _erros: string[];
  [key: string]: any;
}

export default function ImportarTransacoes({
  empresaId,
  onImportado,
}: {
  empresaId: number;
  onImportado: () => void;
}) {
  const [linhas, setLinhas] = useState<LinhaImportada[]>([]);
  const [sucesso, setSucesso] = useState(false);

  const salvar = async () => {
    let algumaSalva = false;

    for (const linha of linhas) {
      if (linha._erros.length > 0) continue;

      const res = await fetch(`/api/empresas/${empresaId}/transacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: linha.titulo,
          valor: parseFloat(String(linha.valor)),
          data: linha.data,
          tipo: linha.tipo || "saida",
          fornecedor: linha.fornecedor || "",
          forma_pagamento: linha.forma_pagamento || "",
          categoria_id: null,
          nicho_id: null,
          cartao_id: null,
        }),
      });

      if (res.ok) algumaSalva = true;
    }

    if (algumaSalva) {
      setSucesso(true);
      onImportado();
      setLinhas([]);
      setTimeout(() => setSucesso(false), 4000);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-2">Importar Transações</h2>
      <ImportarPlanilha onImportar={setLinhas} />

      {linhas.length > 0 && (
        <>
          <table className="w-full text-sm text-left border mb-4">
            <thead>
              <tr>
                {Object.keys(linhas[0])
                  .filter((k) => !k.startsWith("_"))
                  .map((col) => (
                    <th
                      key={col}
                      className="px-2 py-1 border bg-black text-white"
                    >
                      {col}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha, idx) => (
                <tr key={idx}>
                  {Object.entries(linha)
                    .filter(([k]) => !k.startsWith("_"))
                    .map(([key, valor]) => (
                      <td
                        key={key}
                        className={`px-2 py-1 border ${
                          linha._erros.includes(key) ? "bg-red-200" : ""
                        }`}
                      >
                        {typeof valor === "string" || typeof valor === "number"
                          ? valor
                          : "⚠️"}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={salvar}
            className="bg-[#f58723] hover:bg-[#f58723] text-white px-4 py-2 rounded"
          >
            Salvar transações válidas
          </button>

          {sucesso && (
            <div className="mt-4 text-white font-semibold">
              ✅ Transações importadas com sucesso!
            </div>
          )}
        </>
      )}
    </div>
  );
}
