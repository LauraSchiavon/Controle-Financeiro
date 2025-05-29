import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Importa a fonte moderna Geist
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Controle Financeiro",
  description: "Controle seus gastos com estilo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        {/* Estrutura principal com layout em coluna vertical */}
        <div className="flex flex-col min-h-screen">
          {/* Cabeçalho fixo (nav) */}
          <Navbar />

          {/* Conteúdo principal alinhado e centralizado via Grid */}
          <main className="flex-grow py-8">{children}</main>

          {/* Rodapé no final da página */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
