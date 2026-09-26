import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Calendar, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, signup, users } = useSocial();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regBirthdate, setRegBirthdate] = useState('2002-05-14');
  const [regPassword, setRegPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Preencha seu e-mail/usuário e senha.');
      return;
    }
    const success = login(loginIdentifier.trim(), loginPassword);
    if (success) {
      onClose();
    } else {
      setError('Credenciais incorretas.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!termsAccepted) {
      setError('Você deve concordar com os Termos de Uso e LGPD.');
      return;
    }

    const cleanUsername = regUsername.replace('@', '').toLowerCase().trim();
    const success = signup({
      name: regName.trim(),
      username: cleanUsername,
      email: regEmail.trim(),
      birthDate: regBirthdate,
      password: regPassword
    });

    if (success) {
      onClose();
    } else {
      setError('Este nome de usuário ou e-mail já está cadastrado.');
    }
  };

  const handleQuickDemoSwitch = (userEmail: string) => {
    login(userEmail, '123456');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-purple-900/50 rounded-3xl p-5 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="text-center pt-2">
          <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            VIBE
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {mode === 'login'
              ? 'Acesse seu perfil, publicações e Stories 24h'
              : 'Junte-se à nova rede social de momentos e vídeos'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 my-4">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300 mb-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                E-mail ou @usuário
              </label>
              <div className="flex items-center bg-zinc-900 rounded-xl border border-zinc-800 px-3 py-2.5">
                <UserIcon className="w-4 h-4 text-zinc-500 mr-2" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => {
                    setLoginIdentifier(e.target.value);
                    setError('');
                  }}
                  placeholder="seu@email.com ou usuario"
                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">Senha</label>
              <div className="flex items-center bg-zinc-900 rounded-xl border border-zinc-800 px-3 py-2.5">
                <Lock className="w-4 h-4 text-zinc-500 mr-2" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              Entrar na VIBE
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">Nome Completo</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-zinc-900 rounded-xl border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">Nome de Usuário (@)</label>
              <div className="flex items-center bg-zinc-900 rounded-xl border border-zinc-800 px-3 py-2">
                <span className="text-xs text-zinc-500 mr-1">@</span>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="seu_usuario"
                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">E-mail</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-zinc-900 rounded-xl border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Nascimento</label>
                <input
                  type="date"
                  value={regBirthdate}
                  onChange={(e) => setRegBirthdate(e.target.value)}
                  className="w-full bg-zinc-900 rounded-xl border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Senha</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full bg-zinc-900 rounded-xl border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="accent-purple-600 rounded"
              />
              <span className="text-[11px] text-zinc-400 leading-tight">
                Concordo com os Termos de Uso e a Política de Privacidade (LGPD) da VIBE.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs shadow-lg transition-all"
            >
              Concluir Cadastro
            </button>
          </form>
        )}

        {/* Quick Demo Switcher */}
        <div className="mt-5 pt-3 border-t border-zinc-900">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block mb-2 text-center">
            Alternar conta demo para testar:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {users.slice(0, 4).map((u) => (
              <button
                key={u.id}
                onClick={() => handleQuickDemoSwitch(u.email)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors"
              >
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-white truncate">@{u.username}</p>
                  <p className="text-[9px] text-zinc-400 capitalize">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
