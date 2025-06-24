// src/app/api/recipes/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/serverUtils';

// A função GET permanece a mesma por agora
export async function GET() {
  // ... (código existente)
}

// MODIFICADO: Função para criar uma nova receita
export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const newRecipe = await prisma.recipe.create({
      data: {
        userId: user.id, // Associamos a receita ao utilizador autenticado
        name: body.name,
        description: body.description,
        method: body.method,
        yield: body.yield,
        yieldUnit: body.yieldUnit,
      },
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { message: 'Erro ao criar a ficha técnica.' },
      { status: 500 }
    );
  }
}
