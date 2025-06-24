// src/app/recipes/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import IngredientForm from './IngredientForm'; // Importamos nosso novo componente

interface RecipeDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function RecipeDetailsPage({ params }: RecipeDetailsPageProps) {
  const { id } = params;

  // 1. Busca a receita específica E seus ingredientes já vinculados
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: {
        orderBy: { ingredient: { name: 'asc' } }, // Ordena os insumos por nome
        include: {
          ingredient: true,
        },
      },
    },
  });

  // 2. Busca TODOS os insumos disponíveis para popular o dropdown
  const allIngredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' },
  });

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
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Insumos</h2>
          {/* Renderiza nosso novo componente interativo */}
          <IngredientForm 
            recipeId={recipe.id} 
            allIngredients={allIngredients}
            initialRecipeIngredients={recipe.ingredients}
          />
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Modo de Preparo</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{recipe.method}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
