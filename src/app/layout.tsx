import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Importa os componentes que criamos
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  description: "Aplicação para controle financeiro pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Aplica as fontes importadas e suavização de texto */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        {/* Navbar sempre no topo */}
        <Navbar />

        {/* Conteúdo principal, cresce para ocupar espaço disponível */}
        <main className="flex-grow max-w-7xl mx-auto p-4 w-full">
          {children}
        </main>

        {/* Footer sempre no final da página */}
        <Footer />
      </body>
    </html>
  );
}
