// src/app/api/ingredients/[id]/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: {
    id: string;
  };
}

// CÓDIGO EXISTENTE: Função para lidar com requisições PATCH (atualização parcial)
export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedIngredient = await prisma.ingredient.update({
      where: { id: id },
      data: {
        name: body.name,
        category: body.category,
        stockQuantity: body.stockQuantity,
        stockUnit: body.stockUnit,
        lastPurchasePrice: body.lastPurchasePrice,
      },
    });

    return NextResponse.json(updatedIngredient, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Erro ao atualizar o insumo.' }, { status: 500 });
  }
}

// NOVO CÓDIGO: Função para lidar com requisições DELETE
export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const { id } = params; // Pega o ID da URL

    const deletedIngredient = await prisma.ingredient.delete({
      where: {
        id: id, // Encontra e deleta o insumo pelo ID
      },
    });

    return NextResponse.json(deletedIngredient, { status: 200 }); // Retorna o insumo que foi deletado
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ message: 'Erro ao deletar o insumo.' }, { status: 500 });
  }
}
