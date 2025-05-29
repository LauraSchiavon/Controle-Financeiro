"use client";

import React, { useState } from "react";
import Link from "next/link";
import Grid from "./Grid";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false); // controla menu mobile

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg"
    >
      {/* Container centralizado */}
      <Grid>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold hover:opacity-90 transition"
          >
            Controle 💰
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-gray-300 transition">
              Dashboard
            </Link>
            <Link href="/relatorios" className="hover:text-gray-300 transition">
              Relatórios
            </Link>
            <Link
              href="/informacoes"
              className="hover:text-gray-300 transition"
            >
              Informações
            </Link>
          </div>

          {/* Menu mobile botão hamburguer */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            <svg
              className="w-6 h-6 text-white"
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
        </div>

        {/* Menu mobile aberto */}
        {open && (
          <div className="md:hidden mt-2 pb-4 space-y-2 text-sm font-medium text-gray-200">
            <Link
              href="/dashboard"
              className="block hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              href="/relatorios"
              className="block hover:text-white transition"
            >
              Relatórios
            </Link>
            <Link
              href="/informacoes"
              className="block hover:text-white transition"
            >
              Informações
            </Link>
          </div>
        )}
      </Grid>
    </motion.nav>
  );
}
