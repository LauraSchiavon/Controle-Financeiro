"use client";

import React, { ReactNode } from "react";

// Definimos uma interface para o tipo das props do componente
interface GridProps {
  children: ReactNode; // Esse componente vai receber qualquer conteúdo dentro dele
}

export default function Grid({ children }: GridProps) {
  return (
    // Div que controla a largura e a margem lateral do conteúdo
    // max-w-7xl define a largura máxima (1280px)
    // mx-auto centraliza horizontalmente
    // px-4 adiciona padding lateral (16px) para não ficar grudado na borda da tela em telas pequenas
    // sm:px-6 aumenta o padding lateral para 24px em telas pequenas para cima
    // lg:px-8 aumenta o padding lateral para 32px em telas grandes para cima
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  );
}
