// src/app/recipes/new/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook para navegação

export default function NewRecipePage() {
  const router = useRouter(); // Instancia o roteador
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    method: '',
    yield: '',
    yieldUnit: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar a ficha técnica');
      }

      // Após o sucesso, redireciona o usuário para a página de listagem
      router.push('/recipes');
      router.refresh(); // Força a atualização dos dados na página de listagem
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao salvar. Verifique o console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Criar Nova Ficha Técnica</h1>

      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Receita</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição Curta</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700">Modo de Preparo</label>
          <textarea name="method" id="method" value={formData.method} onChange={handleChange} rows={6} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="yield" className="block text-sm font-medium text-gray-700">Rendimento</label>
            <input type="number" name="yield" id="yield" value={formData.yield} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex-1">
            <label htmlFor="yieldUnit" className="block text-sm font-medium text-gray-700">Unidade de Rendimento</label>
            <input type="text" name="yieldUnit" id="yieldUnit" value={formData.yieldUnit} onChange={handleChange} placeholder="Ex: porções, unidades, kg" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">
            {isLoading ? 'Salvando...' : 'Salvar Ficha Técnica'}
          </button>
        </div>
      </form>
    </div>
  );
}
