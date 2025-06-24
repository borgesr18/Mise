// src/middleware.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Cria uma resposta inicial que permite que o pedido continue.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Cria um cliente Supabase que pode operar no servidor/middleware.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Se uma cookie precisar de ser definida, atualizamos o pedido e a resposta.
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Se uma cookie precisar de ser removida, atualizamos o pedido e a resposta.
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Obtém a informação do utilizador autenticado
  const { data: { user } } = await supabase.auth.getUser()

  // --- LÓGICA DE PROTEÇÃO DE ROTAS ---

  // Se o utilizador NÃO estiver autenticado e tentar aceder a uma página protegida...
  if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
    // ...redireciona-o para a página de login.
    const url = new URL('/auth', request.url)
    return NextResponse.redirect(url)
  }

  // Se o utilizador ESTIVER autenticado e tentar aceder à página de login...
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    // ...redireciona-o para a página principal (Insumos).
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  // Se nenhuma das condições de redirecionamento for atendida, permite que o pedido continue.
  return response
}

// Configuração para definir quais rotas o middleware deve proteger.
export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de pedido, exceto os que começam com:
     * - _next/static (ficheiros estáticos)
     * - _next/image (ficheiros de otimização de imagem)
     * - favicon.ico (ícone do site)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
