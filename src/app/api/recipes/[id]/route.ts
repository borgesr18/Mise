// src/app/api/recipes/[id]/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedRecipe = await prisma.recipe.update({
      where: { id: id },
      data: {
        name: body.name,
        description: body.description,
        method: body.method,
        yield: body.yield,
        yieldUnit: body.yieldUnit,
        markup: body.markup, // NOVO: Adicionamos o campo markup
      },
    });

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Erro ao atualizar a ficha técnica.' }, { status: 500 });
  }
}

// ... (A função DELETE continua a mesma abaixo) ...
export async function DELETE(req: Request, { params }: RouteContext) {
  // ...
}
