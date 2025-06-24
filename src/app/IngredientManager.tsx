// src/app/IngredientManager.tsx

"use client"; // Diretiva que transforma este em um Componente de Cliente

import { useState } from 'react';

// Definimos um tipo para o nosso ingrediente para usar com o TypeScript
type Ingredient = {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  stockUnit: string;
};

// O componente recebe a lista inicial de ingredientes do servidor
export default function IngredientManager({
  initialIngredients,
}: {
  initialIngredients: Ingredient[];
}) {
  // Estado para gerenciar a lista de ingredientes na tela
  const [ingredients, setIngredients] = useState(initialIngredients);
  // Estado para gerenciar os dados do novo insumo no formulário
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: '',
    stockQuantity: '',
    stockUnit: '',
    lastPurchasePrice: '',
  });
  // Estado para gerenciar o carregamento durante o envio do formulário
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com a digitação nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o recarregamento da página
    setIsLoading(true);

    const body = {
      ...newIngredient,
      stockQuantity: parseFloat(newIngredient.stockQuantity) || 0,
      lastPurchasePrice: parseFloat(newIngredient.lastPurchasePrice) || 0,
    };

    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar o insumo');
      }

      const createdIngredient = await response.json();
      // Adiciona o novo insumo à lista na tela, sem precisar recarregar
      setIngredients((prev) => [...prev, createdIngredient]);
      // Limpa o formulário
      setNewIngredient({
        name: '',
        category: '',
        stockQuantity: '',
        stockUnit: '',
        lastPurchasePrice: '',
      });
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro. Verifique o console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Mise - Inventário de Insumos
      </h1>

      {/* Formulário de Criação */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Adicionar Novo Insumo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newIngredient.name}
            onChange={handleInputChange}
            placeholder="Nome do Insumo"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="category"
            value={newIngredient.category}
            onChange={handleInputChange}
            placeholder="Categoria (Ex: Secos, Laticínios)"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="stockQuantity"
            value={newIngredient.stockQuantity}
            onChange={handleInputChange}
            placeholder="Quantidade em Estoque"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="stockUnit"
            value={newIngredient.stockUnit}
            onChange={handleInputChange}
            placeholder="Unidade (Ex: kg, litro, unidade)"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            step="0.01"
            name="lastPurchasePrice"
            value={newIngredient.lastPurchasePrice}
            onChange={handleInputChange}
            placeholder="Preço da Última Compra"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        >
          {isLoading ? 'Salvando...' : 'Adicionar Insumo'}
        </button>
      </form>

      {/* Lista de Insumos */}
      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">{ingredient.name}</p>
                <p className="text-sm text-gray-500">{ingredient.category}</p>
              </div>
              <div className="text-right">
                <p className="text-md font-medium text-gray-700">
                  {ingredient.stockQuantity} {ingredient.stockUnit}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
