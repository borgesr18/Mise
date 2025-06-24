// src/app/IngredientManager.tsx

"use client";

import { useState, useEffect } from 'react';

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
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [formState, setFormState] = useState({ name: '', category: '', stockQuantity: '', stockUnit: '', lastPurchasePrice: '' });

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  useEffect(() => {
    if (editingIngredient) {
      setFormState({ name: editingIngredient.name, category: editingIngredient.category, stockQuantity: String(editingIngredient.stockQuantity), stockUnit: editingIngredient.stockUnit, lastPurchasePrice: String(editingIngredient.lastPurchasePrice) });
    }
  }, [editingIngredient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
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

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIngredient) return;
    setIsLoading(true);
    setNotification({ message: '', type: '' });
    
    const body = { ...formState, stockQuantity: parseFloat(formState.stockQuantity) || 0, lastPurchasePrice: parseFloat(formState.lastPurchasePrice) || 0 };

    try {
      const response = await fetch(`/api/ingredients/${editingIngredient.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error('Falha ao atualizar o insumo');

      const updatedIngredient = await response.json();
      setIngredients((prev) => prev.map((ing) => (ing.id === updatedIngredient.id ? updatedIngredient : ing)));
      setEditingIngredient(null);
      setNotification({ message: 'Insumo atualizado com sucesso!', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Erro ao atualizar o insumo.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // NOVO: Função para lidar com a deleção de um insumo
  const handleDelete = async (id: string) => {
    // Passo de confirmação para evitar exclusões acidentais
    if (!window.confirm("Você tem certeza que deseja deletar este insumo? Esta ação não pode ser desfeita.")) {
      return;
    }

    setNotification({ message: '', type: '' });

    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar o insumo');
      }

      // Remove o insumo da lista na tela sem precisar recarregar
      setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
      setNotification({ message: 'Insumo deletado com sucesso!', type: 'success' });

    } catch (error) {
      console.error(error);
      setNotification({ message: 'Erro ao deletar o insumo.', type: 'error' });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* ... (código da notificação e do formulário de criação continua o mesmo) ... */}
      {notification.message && ( <div className={`p-4 mb-4 rounded-md text-center ${ notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}> {notification.message} </div> )}
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Mise - Inventário de Insumos</h1>
      <form onSubmit={handleCreateSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
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
      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">{ingredient.name}</p>
                <p className="text-sm text-gray-500">{ingredient.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-md font-medium text-gray-700 mr-4">{ingredient.stockQuantity} {ingredient.stockUnit}</p>
                <button onClick={() => setEditingIngredient(ingredient)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-300">Editar</button>
                {/* NOVO: Botão de Deletar */}
                <button onClick={() => handleDelete(ingredient.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-600">Deletar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ... (código do modal de edição continua o mesmo) ... */}
      {editingIngredient && ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"> <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg"> <h2 className="text-2xl font-bold mb-4">Editar Insumo</h2> <form onSubmit={handleUpdateSubmit}> <div className="grid grid-cols-1 gap-4"> <input type="text" name="name" value={formState.name} onChange={handleEditFormChange} placeholder="Nome do Insumo" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" /> <input type="text" name="category" value={formState.category} onChange={handleEditFormChange} placeholder="Categoria" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" /> <input type="number" name="stockQuantity" value={formState.stockQuantity} onChange={handleEditFormChange} placeholder="Quantidade" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" /> <input type="text" name="stockUnit" value={formState.stockUnit} onChange={handleEditFormChange} placeholder="Unidade" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" /> <input type="number" step="0.01" name="lastPurchasePrice" value={formState.lastPurchasePrice} onChange={handleEditFormChange} placeholder="Preço" required className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" /> </div> <div className="flex justify-end gap-4 mt-6"> <button type="button" onClick={() => setEditingIngredient(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300">Cancelar</button> <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400">{isLoading ? 'Salvando...' : 'Salvar Alterações'}</button> </div> </form> </div> </div> )}
    </div>
  );
}
