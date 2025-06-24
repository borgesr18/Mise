// src/app/recipes/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface RecipeDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function RecipeDetailsPage({ params }: RecipeDetailsPageProps) {
  const { id } = params;

  // Busca a receita específica E seus ingredientes vinculados
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      // 'include' é o comando do Prisma para trazer dados de tabelas relacionadas
      ingredients: {
        include: {
          // Dentro da relação, inclua os detalhes do próprio insumo
          ingredient: true,
        },
      },
    },
  });

  // Se a receita não for encontrada, mostra uma página de erro 404
  if (!recipe) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{recipe.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{recipe.description}</p>
        <p className="text-md text-gray-500 mt-2">
          Rendimento: {recipe.yield} {recipe.yieldUnit}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna de Insumos */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Insumos</h2>
          {recipe.ingredients.length === 0 ? (
            <p className="text-gray-500">Nenhum insumo adicionado a esta receita ainda.</p>
          ) : (
            <ul className="space-y-2">
              {recipe.ingredients.map((recipeIng) => (
                <li key={recipeIng.ingredient.id} className="flex justify-between">
                  <span>{recipeIng.ingredient.name}</span>
                  <span className="font-medium">
                    {recipeIng.quantity} {recipeIng.ingredient.stockUnit}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {/* Futuramente, o botão para adicionar insumos virá aqui */}
        </div>

        {/* Coluna de Modo de Preparo */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Modo de Preparo</h2>
          <div className="prose max-w-none">
            {/* Usamos 'whitespace-pre-wrap' para respeitar as quebras de linha do texto */}
            <p className="whitespace-pre-wrap">{recipe.method}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
