// src/app/recipes/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import IngredientForm from './IngredientForm';

interface RecipeDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function RecipeDetailsPage({ params }: RecipeDetailsPageProps) {
  const { id } = params;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: {
        orderBy: { ingredient: { name: 'asc' } },
        include: {
          ingredient: true,
        },
      },
    },
  });
  
  const allIngredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' },
  });

  if (!recipe) {
    notFound();
  }

  // NOVO: Lógica para Calcular o Custo Total da Receita
  const totalCost = recipe.ingredients.reduce((acc, recipeIng) => {
    // Custo do item = quantidade usada * preço por unidade do insumo
    const itemCost = recipeIng.quantity * recipeIng.ingredient.lastPurchasePrice;
    return acc + itemCost;
  }, 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{recipe.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{recipe.description}</p>
        <div className="flex items-baseline gap-4 mt-2">
            <p className="text-md text-gray-500">
                Rendimento: {recipe.yield} {recipe.yieldUnit}
            </p>
            {/* NOVO: Exibindo o Custo Total Formatado */}
            <p className="text-md font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                Custo Total: {totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Insumos</h2>
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
