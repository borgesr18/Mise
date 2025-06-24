// src/app/api/recipes/[id]/ingredients/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: {
    id: string; // Este 'id' é o ID da Receita (Recipe)
  };
}

// Função para ADICIONAR um insumo a uma receita específica
export async function POST(req: Request, { params }: RouteContext) {
  try {
    const recipeId = params.id;
    const { ingredientId, quantity } = await req.json();

    // Validação simples
    if (!ingredientId || !quantity) {
      return NextResponse.json(
        { message: 'ID do insumo e quantidade são obrigatórios.' },
        { status: 400 } // Bad Request
      );
    }

    // Cria a entrada na tabela de junção 'RecipeIngredient'
    const newRecipeIngredient = await prisma.recipeIngredient.create({
      data: {
        recipeId: recipeId,
        ingredientId: ingredientId,
        quantity: quantity,
      },
      // Inclui os detalhes do insumo na resposta para facilitar no frontend
      include: {
        ingredient: true,
      },
    });

    return NextResponse.json(newRecipeIngredient, { status: 201 });
  } catch (error) {
    console.error('Error adding ingredient to recipe:', error);
    return NextResponse.json(
      { message: 'Erro ao adicionar insumo à ficha técnica.' },
      { status: 500 }
    );
  }
}
