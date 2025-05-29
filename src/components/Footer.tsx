"use client";

import React from "react";
import Grid from "./Grid";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }} // animação de entrada
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-gray-300 mt-20"
    >
      <Grid>
        <div className="py-6 text-sm flex flex-col md:flex-row items-center justify-center gap-2">
          {/* Texto da esquerda */}
          <span className="text-center md:text-left">
            © {new Date().getFullYear()} Controle Financeiro. Todos os direitos
            reservados.
          </span>

          {/* Links rápidos (se quiser adicionar no futuro)
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition">
              Termos
            </a>
            <a href="#" className="hover:text-white transition">
              Privacidade
            </a>
          </div> */}
        </div>
      </Grid>
    </motion.footer>
  );
}
