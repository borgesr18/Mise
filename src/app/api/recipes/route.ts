// src/app/api/recipes/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Função para LISTAR todas as receitas
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany();
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar as fichas técnicas.' },
      { status: 500 }
    );
  }
}

// Função para CRIAR uma nova receita
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Note que, por enquanto, a criação da receita não incluirá a lista de ingredientes.
    // Faremos essa vinculação em um passo seguinte.
    const newRecipe = await prisma.recipe.create({
      data: {
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
