// src/app/page.tsx

import { prisma } from '@/lib/prisma';
import IngredientManager from './IngredientManager';
import { createSupabaseServerClient } from '@/lib/serverUtils';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Se, por algum motivo, o utilizador chegar aqui sem sessão,
  // redirecionamo-lo para a página de login.
  if (!user) {
    redirect('/auth');
  }

  // MODIFICADO: Busca os insumos ONDE o userId corresponde ao ID do utilizador autenticado
  const initialIngredients = await prisma.ingredient.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return <IngredientManager initialIngredients={initialIngredients} />;
}
