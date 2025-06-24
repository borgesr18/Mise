// src/app/api/ingredients/[id]/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: {
    id: string;
  };
}

// Função para lidar com requisições PATCH (atualização parcial)
export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = params; // Pega o ID da URL
    const body = await req.json(); // Pega os dados a serem atualizados do corpo da requisição

    const updatedIngredient = await prisma.ingredient.update({
      where: {
        id: id, // Encontra o insumo pelo ID
      },
      data: {
        // Atualiza os campos com os novos dados
        name: body.name,
        category: body.category,
        stockQuantity: body.stockQuantity,
        stockUnit: body.stockUnit,
        lastPurchasePrice: body.lastPurchasePrice,
      },
    });

    return NextResponse.json(updatedIngredient, { status: 200 }); // Retorna o insumo atualizado
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar o insumo.' },
      { status: 500 }
    );
  }
}
