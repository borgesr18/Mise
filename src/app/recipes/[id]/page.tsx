// src/app/recipes/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import IngredientForm from './IngredientForm';
import PriceManager from './PriceManager'; // NOVO: Importamos o gerenciador de preço

interface RecipeDetailsPageProps {
  params: { id: string };
}

export default async function RecipeDetailsPage({ params }: RecipeDetailsPageProps) {
  const { id } = params;
  const recipe = await prisma.recipe.findUnique({ where: { id }, include: { ingredients: { orderBy: { ingredient: { name: 'asc' } }, include: { ingredient: true } } } });
  const allIngredients = await prisma.ingredient.findMany({ orderBy: { name: 'asc' } });
  if (!recipe) notFound();

  const totalCost = recipe.ingredients.reduce((acc, recipeIng) => (acc + (recipeIng.quantity * recipeIng.ingredient.lastPurchasePrice)), 0);
  const costPerPortion = recipe.yield > 0 ? totalCost / recipe.yield : 0;

  // MODIFICADO: Usa o markup do banco de dados (com um padrão de 3 se for nulo)
  const markupFactor = recipe.markup ?? 3;
  const suggestedSalePrice = costPerPortion * markupFactor;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800">{recipe.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{recipe.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 border-t pt-4">
          <div><p className="text-sm text-gray-500">Rendimento</p><p className="text-lg font-bold">{recipe.yield} {recipe.yieldUnit}</p></div>
          <div><p className="text-sm text-gray-500">Custo Total</p><p className="text-lg font-bold text-red-600">{totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
          <div><p className="text-sm text-gray-500">Custo por Porção</p><p className="text-lg font-bold text-orange-600">{costPerPortion.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
          <div><p className="text-sm text-gray-500">Preço de Venda ({markupFactor}x)</p><p className="text-lg font-bold text-green-700">{suggestedSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
        </div>
        {/* NOVO: Renderiza o componente para gerenciar o preço */}
        <PriceManager recipeId={recipe.id} initialMarkup={markupFactor} />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1"><h2 className="text-2xl font-semibold border-b pb-2 mb-4">Insumos</h2><IngredientForm recipeId={recipe.id} allIngredients={allIngredients} initialRecipeIngredients={recipe.ingredients} /></div>
        <div className="md:col-span-2"><h2 className="text-2xl font-semibold border-b pb-2 mb-4">Modo de Preparo</h2><div className="prose max-w-none"><p className="whitespace-pre-wrap">{recipe.method}</p></div></div>
      </div>
    </div>
  );
}
