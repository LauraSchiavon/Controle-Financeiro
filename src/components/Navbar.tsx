"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [empresaNome, setEmpresaNome] = useState<string | null>(null);
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [logado, setLogado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuario_id");
    const empresaId = localStorage.getItem("empresa_id");
    setLogado(!!usuarioId);
    setEmpresaId(empresaId);

    if (empresaId && typeof window !== "undefined") {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const url = `${baseUrl}/api/empresas/${empresaId}`;

      fetch(url)
        .then(async (res) => {
          if (!res.ok) throw new Error("Erro ao buscar empresa");
          const data = await res.json();
          if (data?.nome) setEmpresaNome(data.nome);
        })
        .catch((err) => console.error("❌ Erro ao buscar empresa:", err));
    }
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return (
      <nav className="bg-black text-white px-6 py-3 shadow">
        <span className="font-bold text-lg">Controle Financeiro</span>
      </nav>
    );
  }

  // ⛔ Espera empresaId carregar antes de renderizar
  if (!empresaId) return null;

  const links = [
    { href: "/home", label: "Home" },
    { href: `/empresas/${empresaId}/dashboard`, label: "Dashboard" },
    { href: `/empresas/${empresaId}/relatorios`, label: "Relatório" },
    { href: `/empresas/${empresaId}/cartoes`, label: "Cartões" },
    { href: `/empresas/${empresaId}/categorias`, label: "Categorias" },
  ];

  return (
    <nav className="bg-black text-white px-6 py-3 shadow">
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">Controle Financeiro</span>

        <div className="hidden md:flex gap-6 items-center">
          {empresaNome && (
            <span className="text-sm text-orange-400 font-medium">
              📍 {empresaNome}
            </span>
          )}
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              localStorage.removeItem("usuario_id");
              localStorage.removeItem("empresa_id");
              window.location.href = "/login";
            }}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {/* Botão hamburguer */}
        <div className="md:hidden">
          <button onClick={() => setMenuAberto(!menuAberto)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuAberto
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          {empresaNome && (
            <span className="text-sm text-orange-400 font-medium">
              📍 {empresaNome}
            </span>
          )}
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              localStorage.removeItem("usuario_id");
              localStorage.removeItem("empresa_id");
              window.location.href = "/login";
            }}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-1 rounded w-fit"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
