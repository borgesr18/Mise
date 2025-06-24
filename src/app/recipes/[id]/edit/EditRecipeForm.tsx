// src/app/recipes/[id]/edit/EditRecipeForm.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe } from '@prisma/client';

export default function EditRecipeForm({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: recipe.name,
    description: recipe.description || '',
    method: recipe.method,
    yield: recipe.yield.toString(),
    yieldUnit: recipe.yieldUnit,
  });
  const [isLoading, setIsLoading] = useState(false);
  // NOVO: Estado de carregamento específico para a deleção
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      ...formData,
      yield: parseFloat(formData.yield) || 0,
    };

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar a ficha técnica');
      }

      router.push(`/recipes/${recipe.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao guardar as alterações.');
    } finally {
      setIsLoading(false);
    }
  };

  // NOVO: Função para lidar com o clique no botão de apagar
  const handleDelete = async () => {
    if (!window.confirm("Tem a certeza que deseja apagar esta ficha técnica? Esta ação não pode ser desfeita.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao apagar a ficha técnica');
      }

      // Redireciona para a página de listagem após apagar com sucesso
      router.push('/recipes');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao apagar a ficha técnica.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Editar Ficha Técnica</h1>

      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
        {/* ... (campos do formulário continuam os mesmos) ... */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Receita</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição Curta</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700">Modo de Preparo</label>
          <textarea name="method" id="method" value={formData.method} onChange={handleChange} rows={6} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="yield" className="block text-sm font-medium text-gray-700">Rendimento</label>
            <input type="number" name="yield" id="yield" value={formData.yield} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="flex-1">
            <label htmlFor="yieldUnit" className="block text-sm font-medium text-gray-700">Unidade de Rendimento</label>
            <input type="text" name="yieldUnit" id="yieldUnit" value={formData.yieldUnit} onChange={handleChange} placeholder="Ex: porções, unidades, kg" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>
        
        {/* MODIFICADO: Ações do formulário */}
        <div className="flex justify-between items-center pt-4 border-t">
          {/* Botão de Apagar à esquerda */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
          >
            {isDeleting ? 'A apagar...' : 'Apagar Ficha'}
          </button>
          
          {/* Botões de Cancelar e Salvar à direita */}
          <div className="flex gap-4">
            <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading || isDeleting} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">
              {isLoading ? 'A guardar...' : 'Guardar Alterações'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
