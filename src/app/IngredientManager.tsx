// src/app/IngredientManager.tsx

"use client";

import { useState, useEffect, FormEvent } from 'react';

// Tipos de dados
type Ingredient = {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  stockUnit: string;
  lastPurchasePrice: number;
};
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
  const [newIngredient, setNewIngredient] = useState({ name: '', category: '', stockQuantity: '', stockUnit: '', lastPurchasePrice: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification>({ message: '', type: '' });

  // NOVO: Estado para controlar o modal de edição
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  // Efeito para o timer da notificação (sem alterações)
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
  };
  
  // NOVO: Função para lidar com a digitação no formulário de EDIÇÃO
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingIngredient) return;
    const { name, value } = e.target;
    setEditingIngredient({ ...editingIngredient, [name]: value });
  };

  // Lógica para CRIAR um novo insumo (sem alterações)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ message: '', type: '' });

    const body = { ...newIngredient, stockQuantity: parseFloat(newIngredient.stockQuantity) || 0, lastPurchasePrice: parseFloat(newIngredient.lastPurchasePrice) || 0 };

    try {
      const response = await fetch('/api/ingredients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error('Falha ao criar o insumo');
      const createdIngredient = await response.json();
      setIngredients((prev) => [...prev, createdIngredient]);
      setNewIngredient({ name: '', category: '', stockQuantity: '', stockUnit: '', lastPurchasePrice: '' });
      setNotification({ message: 'Insumo adicionado com sucesso!', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Erro ao adicionar o insumo.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // NOVO: Lógica para ATUALIZAR um insumo existente
  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingIngredient) return;
    setIsLoading(true);

    const body = { ...editingIngredient, stockQuantity: Number(editingIngredient.stockQuantity), lastPurchasePrice: Number(editingIngredient.lastPurchasePrice) };

    try {
      const response = await fetch(`/api/ingredients/${editingIngredient.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error('Falha ao atualizar o insumo');
      const updatedIngredient = await response.json();
      
      // Atualiza a lista de insumos na tela
      setIngredients(ingredients.map(ing => ing.id === updatedIngredient.id ? updatedIngredient : ing));
      setEditingIngredient(null); // Fecha o modal
      setNotification({ message: 'Insumo atualizado com sucesso!', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Erro ao atualizar o insumo.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-8 max-w-4xl mx-auto">
      {notification.message && ( <div className={`p-4 mb-4 rounded-md text-center ${ notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}> {notification.message} </div> )}
      <h1 className="text-4xl font-bold mb-6 text-gray-800"> Mise - Inventário de Insumos </h1>
      
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        {/* Formulário de Criação (sem alterações) */}
      </form>

      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="text-lg font-semibold text-gray-800">{ingredient.name}</p>
                <p className="text-sm text-gray-500">{ingredient.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-md font-medium text-gray-700"> {ingredient.stockQuantity} {ingredient.stockUnit} </p>
                {/* NOVO: Botão de Editar */}
                <button onClick={() => setEditingIngredient(ingredient)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm font-semibold"> Editar </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* NOVO: Modal de Edição (só aparece se 'editingIngredient' não for nulo) */}
      {editingIngredient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Editar Insumo</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <input type="text" name="name" value={editingIngredient.name} onChange={handleEditInputChange} className="p-2 border border-gray-300 rounded" />
                <input type="text" name="category" value={editingIngredient.category} onChange={handleEditInputChange} className="p-2 border border-gray-300 rounded" />
                <input type="number" name="stockQuantity" value={editingIngredient.stockQuantity} onChange={handleEditInputChange} className="p-2 border border-gray-300 rounded" />
                <input type="text" name="stockUnit" value={editingIngredient.stockUnit} onChange={handleEditInputChange} className="p-2 border border-gray-300 rounded" />
                <input type="number" step="0.01" name="lastPurchasePrice" value={editingIngredient.lastPurchasePrice} onChange={handleEditInputChange} className="p-2 border border-gray-300 rounded" />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setEditingIngredient(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"> Cancelar </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"> {isLoading ? 'Salvando...' : 'Salvar Alterações'} </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
