// src/app/layout.tsx

import type { Metadata } from 'next';
import Link from 'next/link'; // Importamos o componente de Link do Next.js
import './globals.css';

export const metadata: Metadata = {
  title: 'Mise - Sistema de Gestão',
  description: 'Sistema de gestão de fichas técnicas e insumos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-800">
        {/* NOVO: Cabeçalho com Navegação */}
        <header className="bg-white shadow-md">
          <nav className="max-w-4xl mx-auto p-4 flex gap-8">
            <Link href="/" className="font-semibold text-gray-700 hover:text-blue-600">
              Insumos
            </Link>
            <Link href="/recipes" className="font-semibold text-gray-700 hover:text-blue-600">
              Fichas Técnicas
            </Link>
          </nav>
        </header>

        {/* Conteúdo da página será renderizado aqui */}
        <main>{children}</main>
      </body>
    </html>
  );
}
