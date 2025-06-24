// src/app/recipes/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import IngredientForm from './IngredientForm';
import PriceManager from './PriceManager';
import Link from 'next/link'; // Importar o componente Link

interface RecipeDetailsPageProps {
  params: { id: string };
}

export default async function RecipeDetailsPage({ params }: RecipeDetailsPageProps) {
  const { id } = params;
  
  // Busca todos os dados necessários de uma só vez
  const recipe = await prisma.recipe.findUnique({ 
    where: { id }, 
    include: { 
      ingredients: { 
        orderBy: { ingredient: { name: 'asc' } }, 
        include: { ingredient: true } 
      } 
    } 
  });
  
  const allIngredients = await prisma.ingredient.findMany({ 
    orderBy: { name: 'asc' } 
  });
  
  if (!recipe) {
    notFound();
  }

  // Lógica de cálculo financeiro
  const totalCost = recipe.ingredients.reduce((acc, recipeIng) => (acc + (recipeIng.quantity * recipeIng.ingredient.lastPurchasePrice)), 0);
  const costPerPortion = recipe.yield > 0 ? totalCost / recipe.yield : 0;
  const markupFactor = recipe.markup ?? 3;
  const suggestedSalePrice = costPerPortion * markupFactor;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* CABEÇALHO COMPLETO */}
      <header className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{recipe.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{recipe.description}</p>
          </div>
          <Link href={`/recipes/${recipe.id}/edit`} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 whitespace-nowrap">
            Editar Ficha
          </Link>
        </div>
        
        {/* PAINEL FINANCEIRO RESTAURADO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
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
            <p className="text-sm text-gray-500">Preço de Venda ({markupFactor}x)</p>
            <p className="text-lg font-bold text-green-700">
              {suggestedSalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
        
        {/* GESTOR DE PREÇO */}
        <PriceManager recipeId={recipe.id} initialMarkup={markupFactor} />
      </header>

      {/* CONTEÚDO PRINCIPAL RESTAURADO */}
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
