// src/app/page.tsx

import { prisma } from '@/lib/prisma';
import IngredientManager from './IngredientManager'; // Importamos nosso novo componente

export default async function HomePage() {
  // 1. Busca os dados iniciais no servidor
  const initialIngredients = await prisma.ingredient.findMany();

  // 2. Renderiza o componente de cliente, passando os dados para ele
  return <IngredientManager initialIngredients={initialIngredients} />;
}
