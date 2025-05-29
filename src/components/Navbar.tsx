"use client";

import React, { useState } from "react";
import Grid from "./Grid";

export default function Navbar() {
  // Controla se o menu mobile está aberto (true) ou fechado (false)
  const [open, setOpen] = useState(false);

  return (
    // Nav com fundo cinza escuro e texto claro
    <nav className="bg-gray-900 text-white">
      <Grid>
        {/* Linha principal com logo e botão hamburguer */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold">Controle Financeiro</div>

          {/* Botão hamburger só aparece em telas pequenas */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)} // Alterna estado open para abrir/fechar menu
            aria-label="Toggle menu"
          >
            {/* Ícone muda dependendo se o menu está aberto ou fechado */}
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Menu para desktop: visível só em md+ */}
          <div className="hidden md:flex space-x-6 text-gray-300 font-medium">
            <a
              href="/"
              className="hover:text-white transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="/register"
              className="hover:text-white transition-colors duration-200"
            >
              Cadastro
            </a>
            <a
              href="/login"
              className="hover:text-white transition-colors duration-200"
            >
              Login
            </a>
          </div>
        </div>
      </Grid>

      {/* Menu para mobile, aparece fora do Grid, ocupando toda a largura */}
      {/* Assim o menu fica "embaixo" da barra e com fundo escuro completo */}
      {open && (
        <div className="md:hidden bg-gray-900 px-4 pb-4 space-y-3 text-gray-300 font-medium">
          <a
            href="/"
            className="block hover:text-white transition-colors duration-200"
            onClick={() => setOpen(false)} // Fecha menu ao clicar no link
          >
            Home
          </a>
          <a
            href="/register"
            className="block hover:text-white transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            Cadastro
          </a>
          <a
            href="/login"
            className="block hover:text-white transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
}
