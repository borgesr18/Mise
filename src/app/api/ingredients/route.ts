// src/app/api/ingredients/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/serverUtils'; // Importamos a nossa nova função auxiliar

// A função GET permanece a mesma por agora
export async function GET() {
  // ... (código existente)
}

// MODIFICADO: Função para lidar com pedidos POST
export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Se não houver utilizador, recusa o pedido
  if (!user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const newIngredient = await prisma.ingredient.create({
      data: {
        // A MUDANÇA PRINCIPAL ESTÁ AQUI:
        userId: user.id, // Associamos o insumo ao utilizador autenticado
        name: body.name,
        category: body.category,
        stockQuantity: body.stockQuantity,
        stockUnit: body.stockUnit,
        lastPurchasePrice: body.lastPurchasePrice,
      },
    });

    return NextResponse.json(newIngredient, { status: 201 });
  } catch (error) {
    console.error('Error creating ingredient:', error);
    return NextResponse.json(
      { message: 'Erro ao criar o insumo.' },
      { status: 500 }
    );
  }
}
