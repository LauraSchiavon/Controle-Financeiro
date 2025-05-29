"use client";

import React from "react";
import Grid from "./Grid";
import Link from "next/link";

export default function Footer() {
  return (
    // Rodapé com fundo preto e texto cinza claro
    <footer className="bg-gray-900 text-gray-400 py-6">
      {/* Grid para centralizar e limitar a largura do conteúdo */}
      <Grid>
        {/* Flex container para colocar textos e links lado a lado em desktop e empilhados no mobile */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Texto do copyright */}
          <p>© 2025 Controle Financeiro. Todos os direitos reservados.</p>

          {/* Links adicionais do footer */}
          {/* mt-2 no mobile para dar espaçamento em cima, removido no desktop */}
          <div className="mt-2 md:mt-0">
            <Link href="#" className="hover:text-white mx-2">
              Privacidade
            </Link>
            <Link href="#" className="hover:text-white mx-2">
              Termos
            </Link>
            <Link href="#" className="hover:text-white mx-2">
              Contato
            </Link>
          </div>
        </div>
      </Grid>
    </footer>
  );
}
