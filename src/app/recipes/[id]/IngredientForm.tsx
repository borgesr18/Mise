// src/app/recipes/[id]/IngredientForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Tipos para nos ajudar com o TypeScript
type Ingredient = {
  id: string;
  name: string;
  stockUnit: string;
};

type RecipeIngredient = {
  quantity: number;
  ingredient: Ingredient;
};

// O componente recebe o ID da receita e a lista de todos os insumos disponíveis
export default function IngredientForm({
  recipeId,
  allIngredients,
  initialRecipeIngredients
}: {
  recipeId: string;
  allIngredients: Ingredient[];
  initialRecipeIngredients: RecipeIngredient[];
}) {
  const router = useRouter();
  // Estado para a lista de insumos JÁ NA receita (para atualizar em tempo real)
  const [recipeIngredients, setRecipeIngredients] = useState(initialRecipeIngredients);

  // Estado para os campos do nosso novo formulário
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredientId || !quantity) {
      alert("Por favor, selecione um insumo e defina uma quantidade.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientId: selectedIngredientId,
          quantity: parseFloat(quantity),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao adicionar o insumo');
      }

      const newRecipeIngredient = await response.json();
      // Adiciona o novo insumo à lista na tela
      setRecipeIngredients(prev => [...prev, newRecipeIngredient]);

      // Limpa o formulário
      setSelectedIngredientId('');
      setQuantity('');

    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao adicionar o insumo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Formulário para adicionar novos insumos */}
      <form onSubmit={handleSubmit} className="p-4 mb-6 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Adicionar Insumo à Receita</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedIngredientId}
            onChange={(e) => setSelectedIngredientId(e.target.value)}
            required
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Selecione um insumo...</option>
            {allIngredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantidade"
            required
            className="w-full md:w-32 p-2 border border-gray-300 rounded-md shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? '...' : 'Adicionar'}
          </button>
        </div>
      </form>

      {/* Lista de insumos já na receita */}
      {recipeIngredients.length === 0 ? (
        <p className="text-gray-500">Nenhum insumo adicionado a esta receita ainda.</p>
      ) : (
        <ul className="space-y-2">
          {recipeIngredients.map((recipeIng) => (
            <li key={recipeIng.ingredient.id} className="flex justify-between p-2 bg-white rounded shadow-sm">
              <span>{recipeIng.ingredient.name}</span>
              <span className="font-medium">
                {recipeIng.quantity} {recipeIng.ingredient.stockUnit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
