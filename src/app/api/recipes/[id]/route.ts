// src/app/api/recipes/[id]/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: {
    id: string;
  };
}

// CÓDIGO EXISTENTE: Função para lidar com pedidos PATCH (atualização parcial)
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
        markup: body.markup,
      },
    });

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Erro ao atualizar a ficha técnica.' }, { status: 500 });
  }
}

// NOVO CÓDIGO: Função para lidar com pedidos DELETE
export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const { id } = params;

    // Devido à nossa regra `onDelete: Cascade` na tabela RecipeIngredient,
    // apagar uma receita irá apagar automaticamente todos os vínculos de ingredientes.
    const deletedRecipe = await prisma.recipe.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedRecipe, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    // Erro comum é tentar apagar uma receita que ainda tem Ordens de Produção ligadas a ela.
    // O Prisma irá bloquear isso para proteger a integridade dos dados.
    return NextResponse.json({ message: 'Erro ao apagar a ficha técnica. Verifique se não existem ordens de produção associadas.' }, { status: 500 });
  }
}
