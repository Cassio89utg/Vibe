import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Eye,
  Shield,
  Bell,
  Smartphone,
  Download,
  Trash2,
  LogOut,
  UserX,
  HelpCircle,
  Info,
  Check,
  ShieldAlert
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

interface SettingsViewProps {
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onClose, onOpenAdmin }) => {
  const { currentUser, updateProfile, logout, unblockUser, users } = useSocial();

  const [isPrivate, setIsPrivate] = useState(currentUser?.isPrivate || false);
  const [allowMessages, setAllowMessages] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const handleTogglePrivate = () => {
    const nextVal = !isPrivate;
    setIsPrivate(nextVal);
    updateProfile({ isPrivate: nextVal });
    showToast(nextVal ? 'Conta alterada para Privada' : 'Conta alterada para Pública');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleDownloadDataLGPD = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(currentUser, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vibe_lgpd_dados_${currentUser?.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Dados baixados de acordo com as normas da LGPD!');
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Tem certeza que deseja solicitar a exclusão de sua conta na VIBE? Todos os dados serão removidos.'
      )
    ) {
      logout();
      onClose();
    }
  };

  const blockedUsers = users.filter((u) => currentUser?.blockedUserIds?.includes(u.id));

  return (
    <div
      id="settings-view"
      className="fixed inset-0 z-50 bg-black flex flex-col max-w-md mx-auto select-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-white">Configurações</h2>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={onOpenAdmin}
            className="px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-500/50 text-[11px] font-bold text-purple-300 flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Painel Admin
          </button>
        )}
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-purple-900/80 border border-purple-500/60 text-xs text-white font-semibold flex items-center gap-2 shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Settings Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-10">
        {/* Privacidade */}
        <div>
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Privacidade
          </h3>
          <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
            {/* Conta Privada */}
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Conta privada</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Somente seguidores aprovados podem ver suas publicações
                </p>
              </div>
              <button
                onClick={handleTogglePrivate}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  isPrivate ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isPrivate ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Permitir Mensagens */}
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Permitir mensagens</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Receber mensagens privadas de outros usuários
                </p>
              </div>
              <button
                onClick={() => setAllowMessages(!allowMessages)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  allowMessages ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    allowMessages ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Permitir Comentários */}
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Permitir comentários</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Usuários podem comentar em suas postagens
                </p>
              </div>
              <button
                onClick={() => setAllowComments(!allowComments)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  allowComments ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    allowComments ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Permitir Menções */}
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Permitir menções</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Outras pessoas podem marcar seu @ em publicações
                </p>
              </div>
              <button
                onClick={() => setAllowMentions(!allowMentions)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  allowMentions ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    allowMentions ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div>
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Segurança
          </h3>
          <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
            <div
              onClick={() => showToast('Link de redefinição de senha enviado para seu e-mail!')}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/40"
            >
              <div>
                <p className="text-xs font-semibold text-white">Alterar senha</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Atualize sua senha periodicamente para maior segurança
                </p>
              </div>
              <span className="text-xs text-purple-400">Alterar</span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Dispositivos conectados</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  1 sessão ativa (Este navegador / Dispositivo móvel)
                </p>
              </div>
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Usuários Bloqueados */}
        <div>
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <UserX className="w-3.5 h-3.5" />
            Usuários Bloqueados
          </h3>
          <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-3">
            {blockedUsers.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-2">
                Nenhum usuário bloqueado.
              </p>
            ) : (
              <div className="space-y-2">
                {blockedUsers.map((bu) => (
                  <div key={bu.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={bu.avatarUrl}
                        alt={bu.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-xs text-white">@{bu.username}</span>
                    </div>
                    <button
                      onClick={() => {
                        unblockUser(bu.id);
                        showToast(`Usuário @${bu.username} desbloqueado!`);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    >
                      Desbloquear
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LGPD & Controle de Dados */}
        <div>
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            LGPD & Armazenamento de Dados
          </h3>
          <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
            <button
              onClick={handleDownloadDataLGPD}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-white">
                  Baixar meus dados (LGPD)
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Exportar cópia dos seus dados de perfil e preferências em JSON
                </p>
              </div>
              <Download className="w-4 h-4 text-purple-400" />
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-red-950/20 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-red-400">
                  Solicitar exclusão da conta
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Direito ao esquecimento garantido pela LGPD
                </p>
              </div>
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Sobre a VIBE */}
        <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/80 text-center">
          <h4 className="text-sm font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            VIBE
          </h4>
          <p className="text-[11px] text-zinc-400 mt-0.5 italic">
            "Sua vida. Seu momento. Sua VIBE."
          </p>
          <p className="text-[10px] text-zinc-500 mt-2">
            Versão 1.0.0 • Mobile-first com vídeos verticais, Stories e publicações temporárias de 24h.
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-red-400 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          Sair da Conta
        </button>
      </div>
    </div>
  );
};
