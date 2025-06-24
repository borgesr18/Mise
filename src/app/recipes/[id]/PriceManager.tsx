// src/app/recipes/[id]/PriceManager.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PriceManager({
  recipeId,
  initialMarkup,
}: {
  recipeId: string;
  initialMarkup: number;
}) {
  const router = useRouter();
  const [markup, setMarkup] = useState(initialMarkup);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveMarkup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markup: Number(markup) }), // Envia apenas o markup
      });
      if (!response.ok) throw new Error('Falha ao salvar o markup');

      alert('Margem de lucro salva!');
      router.refresh(); // Recarrega os dados da página para refletir o novo cálculo
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar a margem de lucro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <label htmlFor="markup" className="block text-sm font-medium text-gray-700">
        Fator de Markup (ex: 3 para 300%)
      </label>
      <div className="flex gap-2 mt-1">
        <input
          type="number"
          id="markup"
          step="0.1"
          value={markup}
          onChange={(e) => setMarkup(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
        <button
          onClick={handleSaveMarkup}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? '...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}
