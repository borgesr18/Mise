// src/app/page.tsx

import { prisma } from '@/lib/prisma';

// A página agora é uma função assíncrona, permitindo o uso do 'await'
export default async function HomePage() {
  // 1. Buscando os dados diretamente do banco no servidor
  const ingredients = await prisma.ingredient.findMany();

  // 2. Renderizando os dados em formato de lista
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
        Mise - Inventário de Insumos
      </h1>

      {/* Verificação: Se não houver insumos, mostre uma mensagem */}
      {ingredients.length === 0 ? (
        <p>Nenhum insumo cadastrado ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {/* Mapeando cada insumo para um item da lista */}
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.id}
              style={{
                padding: '1rem',
                border: '1px solid #ccc',
                marginBottom: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>
                <strong>{ingredient.name}</strong> ({ingredient.category})
              </span>
              <span>
                Estoque: {ingredient.stockQuantity} {ingredient.stockUnit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
