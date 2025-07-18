// src/app/auth/page.tsx

"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        // Lógica de Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }
        
        // SUCESSO! Força um recarregamento completo do navegador na página principal.
        // Este é o método mais fiável para garantir que a nova sessão seja reconhecida.
        window.location.href = '/';

      } else {
        // Lógica de Registo
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }
        setMessage('Registo bem-sucedido! Pode agora fazer login.');
        setIsLogin(true); // Muda para a tela de login após o registo
      }

    } catch (error: any) {
      // Limpa a palavra-passe em caso de erro para que o utilizador possa tentar novamente.
      setPassword('');
      setMessage(`Erro: ${error.error_description || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          {isLogin ? 'Entrar no Mise' : 'Criar Conta'}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" placeholder="o.seu@email.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Palavra-passe</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? 'A processar...' : (isLogin ? 'Entrar' : 'Registar')}
          </button>
        </form>

        {message && <p className={`text-center ${message.startsWith('Erro:') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

        <p className="text-sm text-center text-gray-600">
          {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
          <button onClick={() => { setIsLogin(!isLogin); setMessage(''); }} className="ml-1 font-semibold text-blue-600 hover:underline">
            {isLogin ? 'Registe-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
}

