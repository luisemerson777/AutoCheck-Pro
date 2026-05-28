import React, { useState } from 'react';

// Tela de login que consome a API em /api/login
const Login = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!user || !password) {
      setError('Preencha usuário e senha');
      return;
    }

    if (!onLogin) {
      setError('Erro ao inicializar login');
      return;
    }

    try {
      setIsLoading(true);
      onLogin(
        { username: user, password }, 
        (u) => {
          console.log('✅ Login realizado:', u);
        }, 
        (err) => {
          setError(err || 'Falha ao autenticar');
          console.error('❌ Erro de login:', err);
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[1.25rem] p-8 shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1D63BD] to-cyan-500 flex items-center justify-center text-white text-2xl font-black mb-3">AC</div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">AutoCheck</h2>
          <p className="text-slate-400 font-medium">Sistema de inspeção</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Usuário</label>
            <input 
              required 
              className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border border-slate-200 dark:border-slate-700 focus:border-[#1D63BD]" 
              placeholder="luis" 
              value={user} 
              onChange={(e) => setUser(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Senha</label>
            <input 
              required 
              type="password" 
              className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border border-slate-200 dark:border-slate-700 focus:border-[#1D63BD]" 
              placeholder="••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-bold rounded-lg">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 ${isLoading ? 'bg-slate-400' : 'bg-[#1D63BD] hover:bg-[#154A8D]'} text-white font-bold rounded-2xl transition-colors`}
          >
            {isLoading ? 'Autenticando...' : 'Acessar'}
          </button>
          <div className="mt-6 text-center text-xs text-slate-400">
            <p>AutoCheck © 2024</p>
            <p className="mt-2 text-slate-500">Usando Supabase PostgreSQL</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
