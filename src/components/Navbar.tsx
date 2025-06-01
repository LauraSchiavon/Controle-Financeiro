"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("empresa_id");
    const usuarioId = localStorage.getItem("usuario_id");
    setEmpresaId(id);
    setLogado(!!usuarioId);
  }, []);

  const isHomePage = pathname === "/login" || pathname === "/register";

  if (isHomePage) {
    return (
      <nav className="bg-black text-white px-6 py-3 shadow">
        <span className="font-bold text-lg">Controle Financeiro</span>
      </nav>
    );
  }

  return (
    <nav className="bg-black text-white px-6 py-3 shadow flex justify-between items-center">
      <span className="font-bold text-lg">Controle Financeiro</span>

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
              Categoria
            </Link>
            {/* <Link
              href={`/empresas/${empresaId}/transacoes`}
              className="hover:underline"
            >
              Transações
            </Link> */}
          </>
        )}

        {/* <Link href="/perfil" className="hover:underline">
          Meu Perfil
        </Link> */}

        <button
          onClick={() => {
            localStorage.removeItem("usuario_id");
            localStorage.removeItem("empresa_id");
            window.location.href = "/login";
          }}
          className="hover:underline text-red-400"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
