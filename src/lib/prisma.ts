// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client'

// Esta declaração estende o tipo global do Node.js
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// O 'singleton' garante que haverá apenas uma instância do PrismaClient,
// evitando criar múltiplas conexões com o banco de dados em desenvolvimento.
export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
