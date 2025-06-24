// src/app/recipes/[id]/edit/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditRecipeForm from './EditRecipeForm'; // Criaremos este componente a seguir

interface EditRecipePageProps {
  params: { id: string };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
  });

  if (!recipe) {
    notFound();
  }

  // Passamos os dados da receita para o componente de formulário
  return <EditRecipeForm recipe={recipe} />;
}
