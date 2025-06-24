// src/app/recipes/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import IngredientForm from './IngredientForm';
import PriceManager from './PriceManager';
import Link from 'next/link'; // Não se esqueça de importar o Link

// ... (interface e função de busca continuam as mesmas) ...
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
    const markupFactor = recipe.markup ?? 3;
    const suggestedSalePrice = costPerPortion * markupFactor;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-8 p-6 bg-white rounded-lg shadow-md">
                {/* NOVO: Div para alinhar o título e o botão */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">{recipe.name}</h1>
                        <p className="text-lg text-gray-600 mt-2">{recipe.description}</p>
                    </div>
                    <Link href={`/recipes/${recipe.id}/edit`} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 whitespace-nowrap">
                        Editar Ficha
                    </Link>
                </div>

                {/* ... (resto do cabeçalho com os cálculos financeiros continua o mesmo) ... */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 border-t pt-4">
                    {/* ... */}
                </div>
                <PriceManager recipeId={recipe.id} initialMarkup={markupFactor} />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* ... (resto da página continua o mesmo) ... */}
            </div>
        </div>
    );
}
