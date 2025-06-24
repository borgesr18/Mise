// src/app/recipes/page.tsx

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function RecipesPage() {
  // Busca todas as receitas no servidor
  const recipes = await prisma.recipe.findMany();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Fichas Técnicas</h1>
        {/* Futuramente, aqui teremos um botão para adicionar nova receita */}
      </div>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          Nenhuma ficha técnica cadastrada ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">{recipe.name}</h2>
              <p className="text-gray-600 mt-2">{recipe.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Rendimento: {recipe.yield} {recipe.yieldUnit}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
