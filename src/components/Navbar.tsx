// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Verifica se está nas páginas de login ou register
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Verifica se está em /empresas/[id]/...
  const match = pathname.match(/^\/empresas\/(\d+)/);
  const empresaId = match ? match[1] : null;

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow">
      <div className="text-lg font-bold">💼 Controle Financeiro</div>

      {/* Oculta os links se for página de login ou register */}
      {!isAuthPage && (
        <div className="space-x-4">
          <Link href="/home" className="hover:underline">
            Home
          </Link>

          {empresaId && (
            <>
              <Link
                href={`/empresas/${empresaId}/dashboard`}
                className="hover:underline"
              >
                Dashboard
              </Link>
              <Link
                href={`/empresas/${empresaId}/relatorios`}
                className="hover:underline"
              >
                Relatório
              </Link>
              <Link
                href={`/empresas/${empresaId}/cartoes`}
                className="hover:underline"
              >
                Cartões
              </Link>
              <Link
                href={`/empresas/${empresaId}/categorias`}
                className="hover:underline"
              >
                Categorias
              </Link>
            </>
          )}

          <Link href="/meu-perfil" className="hover:underline">
            Meu Perfil
          </Link>

          <Link href="/login" className="hover:underline text-red-400">
            Sair
          </Link>
        </div>
      )}
    </nav>
  );
}
