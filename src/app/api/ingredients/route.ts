// src/app/api/ingredients/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Importamos nossa instância única do Prisma

// A função PRECISA se chamar POST em maiúsculas e ser exportada.
export async function POST(req: Request) {
  try {
    // Pega os dados enviados no corpo da requisição
    const body = await req.json()

    // Usa o Prisma Client para criar um novo ingrediente no banco de dados
    const newIngredient = await prisma.ingredient.create({
      data: {
        name: body.name,
        category: body.category,
        stockQuantity: body.stockQuantity,
        stockUnit: body.stockUnit,
        lastPurchasePrice: body.lastPurchasePrice,
      },
    })

    // Retorna o ingrediente criado com um status 201 (Created)
    return NextResponse.json(newIngredient, { status: 201 })
  } catch (error) {
    // Em caso de erro, loga o erro no console do servidor
    console.error('Error creating ingredient:', error)
    // E retorna uma resposta de erro com status 500 (Internal Server Error)
    return NextResponse.json(
      { message: 'Erro ao criar o insumo.' },
      { status: 500 }
    )
  }
}
