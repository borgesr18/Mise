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

  // --- LÓGICA DE CÁLCULO FINANCEIRO ---
  
  // 1. Custo Total
  const totalCost = recipe.ingredients.reduce((acc, recipeIng) => {
    const itemCost = recipeIng.quantity * recipeIng.ingredient.lastPurchasePrice;
    return acc + itemCost;
  }, 0);

  // 2. NOVO: Custo por Porção
  // Evita divisão por zero se o rendimento for 0
  const costPerPortion = recipe.yield > 0 ? totalCost / recipe.yield : 0;

  // 3. NOVO: Preço de Venda Sugerido (Markup de 3x)
  const markupFactor = 3;
  const suggestedSalePrice = costPerPortion * markupFactor;


  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800">{recipe.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{recipe.description}</p>
        
        {/* Métricas Financeiras */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 border-t pt-4">
          <div>
            <p className="text-sm text-gray-500">Rendimento</p>
            <p className="text-lg font-bold">{recipe.yield} {recipe.yieldUnit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Custo Total</p>
            <p className="text-lg font-bold text-red-600">
              {totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Custo por Porção</p>
            <p className="text-lg font-bold text-orange-600">
              {costPerPortion.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Preço de Venda (3x)</p>
            <p className="text-lg font-bold text-green-700">
              {suggestedSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ... (resto do código continua o mesmo) ... */}
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
