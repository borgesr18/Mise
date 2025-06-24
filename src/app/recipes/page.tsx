// src/app/recipes/page.tsx

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Fichas Técnicas</h1>
        {/* NOVO: Botão para levar à página de criação */}
        <Link
          href="/recipes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Nova Ficha Técnica
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">
            Nenhuma ficha técnica cadastrada ainda.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Clique em "Nova Ficha Técnica" para começar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800">{recipe.name}</h2>
              <p className="text-gray-600 mt-2 truncate">{recipe.description}</p>
              <p className="text-sm text-gray-500 mt-3">
                Rendimento: {recipe.yield} {recipe.yieldUnit}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
