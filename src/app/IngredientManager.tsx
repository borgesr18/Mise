// src/app/IngredientManager.tsx

"use client";

import { useState, useEffect } from 'react'; // NOVO: Importamos o useEffect

// Definimos um tipo para o nosso ingrediente
type Ingredient = {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  stockUnit: string;
};

// NOVO: Definimos um tipo para nossa notificação
type Notification = {
  message: string;
  type: 'success' | 'error' | '';
};

export default function IngredientManager({
  initialIngredients,
}: {
  initialIngredients: Ingredient[];
}) {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: '',
    stockQuantity: '',
    stockUnit: '',
    lastPurchasePrice: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  // NOVO: Estado para gerenciar a notificação
  const [notification, setNotification] = useState<Notification>({ message: '', type: '' });

  // NOVO: Efeito que faz a notificação desaparecer após 3 segundos
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
    }
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ message: '', type: '' }); // Limpa notificações antigas

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
      setIngredients((prev) => [...prev, createdIngredient]);
      setNewIngredient({ name: '', category: '', stockQuantity: '', stockUnit: '', lastPurchasePrice: '' });
      // NOVO: Define a notificação de sucesso
      setNotification({ message: 'Insumo adicionado com sucesso!', type: 'success' });
    } catch (error) {
      console.error(error);
      // NOVO: Define a notificação de erro
      setNotification({ message: 'Erro ao adicionar o insumo. Tente novamente.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* NOVO: Componente de Notificação */}
      {notification.message && (
        <div
          className={`p-4 mb-4 rounded-md text-center ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Mise - Inventário de Insumos
      </h1>

      {/* Formulário de Criação */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Adicionar Novo Insumo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={newIngredient.name} onChange={handleInputChange} placeholder="Nome do Insumo" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" name="category" value={newIngredient.category} onChange={handleInputChange} placeholder="Categoria (Ex: Secos, Laticínios)" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" name="stockQuantity" value={newIngredient.stockQuantity} onChange={handleInputChange} placeholder="Quantidade em Estoque" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" name="stockUnit" value={newIngredient.stockUnit} onChange={handleInputChange} placeholder="Unidade (Ex: kg, litro, unidade)" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" step="0.01" name="lastPurchasePrice" value={newIngredient.lastPurchasePrice} onChange={handleInputChange} placeholder="Preço da Última Compra" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" disabled={isLoading} className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400">
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
