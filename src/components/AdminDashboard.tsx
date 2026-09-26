import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  Users,
  Film,
  Clock,
  CircleDot,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Sparkles,
  RefreshCw,
  BadgeCheck,
  Ban
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    users,
    posts,
    stories,
    reports,
    getActivePosts,
    getActiveStories,
    cleanExpiredContent,
    resolveReport,
    deletePost,
    updateUserBan,
    toggleUserVerification
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'metrics' | 'reports' | 'users'>('metrics');
  const [cleanLog, setCleanLog] = useState('');

  const activePosts = getActivePosts();
  const active24hPosts = activePosts.filter((p) => p.category === '24h');
  const permanentPosts = activePosts.filter((p) => p.category === 'permanent');
  const activeStoriesList = getActiveStories();
  const pendingReports = reports.filter((r) => r.status === 'pending');

  const handleRunCleanup = () => {
    const expiredCount = cleanExpiredContent();
    setCleanLog(
      `Limpeza executada com sucesso! ${expiredCount} item(ns) expirado(s) de 24h arquivado(s).`
    );
    setTimeout(() => setCleanLog(''), 4000);
  };

  return (
    <div
      id="admin-dashboard"
      className="fixed inset-0 z-50 bg-black flex flex-col max-w-md mx-auto select-none"
    >
      {/* Top Bar */}
      <div className="p-4 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              Painel Administrativo VIBE
            </h2>
            <p className="text-[10px] text-zinc-400">Moderação e métricas da rede</p>
          </div>
        </div>

        <button
          onClick={handleRunCleanup}
          className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
          title="Executar Limpeza de 24h"
        >
          <RefreshCw className="w-3 h-3" />
          Limpar 24h
        </button>
      </div>

      {/* Cleanup Feedback */}
      {cleanLog && (
        <div className="mx-3 mt-2 p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/50 text-xs text-purple-200 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          {cleanLog}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-900 bg-zinc-900/40">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'metrics'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Métricas
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeTab === 'reports'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Denúncias
          {pendingReports.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px]">
              {pendingReports.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Usuários ({users.length})
        </button>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Users */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-[11px] font-semibold text-zinc-400">Usuários</span>
                </div>
                <p className="text-xl font-extrabold text-white">{users.length}</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">Cadastrados ativos</p>
              </div>

              {/* Total Posts */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-2 text-pink-400 mb-1">
                  <Film className="w-4 h-4" />
                  <span className="text-[11px] font-semibold text-zinc-400">Total Posts</span>
                </div>
                <p className="text-xl font-extrabold text-white">{posts.length}</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">
                  {permanentPosts.length} permanentes
                </p>
              </div>

              {/* 24h Posts */}
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 shadow-sm">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] font-semibold text-purple-300">Posts 24H</span>
                </div>
                <p className="text-xl font-extrabold text-purple-200">{active24hPosts.length}</p>
                <p className="text-[9px] text-purple-400 mt-0.5">Visíveis no feed</p>
              </div>

              {/* Active Stories */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <CircleDot className="w-4 h-4" />
                  <span className="text-[11px] font-semibold text-zinc-400">Stories 24h</span>
                </div>
                <p className="text-xl font-extrabold text-white">{activeStoriesList.length}</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">Na barra superior</p>
              </div>
            </div>

            {/* Expired Job Simulator */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Motor de Expiração Automática (24h)
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Na VIBE, todas as publicações temporárias e Stories recebem o carimbo <code className="text-purple-300">expiresAt = createdAt + 24 horas</code>. Quando expiram, deixam imediatamente de ser exibidos nos feeds públicos.
              </p>
              <button
                onClick={handleRunCleanup}
                className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-semibold transition-colors"
              >
                Forçar verificação de expiração agora
              </button>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-10">
                Nenhuma denúncia registrada no sistema.
              </p>
            ) : (
              reports.map((report) => {
                const targetPost = posts.find((p) => p.id === report.postId);
                const isPending = report.status === 'pending';

                return (
                  <div
                    key={report.id}
                    className={`p-3.5 rounded-2xl border ${
                      isPending
                        ? 'bg-red-950/20 border-red-900/50'
                        : 'bg-zinc-900/50 border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                        Motivo: {report.reason}
                      </span>
                      <span className="text-[9px] text-zinc-500">{report.createdAt}</span>
                    </div>

                    {report.details && (
                      <p className="text-xs text-zinc-300 mb-2 italic">
                        "{report.details}"
                      </p>
                    )}

                    {targetPost ? (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 mb-2">
                        <img
                          src={targetPost.thumbnailUrl || targetPost.mediaUrl}
                          alt="preview"
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-white truncate">
                            @{targetPost.user.username}
                          </p>
                          <p className="text-[10px] text-zinc-400 truncate">
                            {targetPost.caption}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 mb-2">
                        (Publicação já foi excluída da plataforma)
                      </p>
                    )}

                    {isPending && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => resolveReport(report.id, 'dismiss')}
                          className="flex-1 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-300 transition-colors"
                        >
                          Ignorar
                        </button>

                        {targetPost && (
                          <button
                            onClick={() => {
                              deletePost(targetPost.id);
                              resolveReport(report.id, 'delete_content');
                            }}
                            className="flex-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-[11px] font-semibold text-white transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remover Post
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-700 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white flex items-center gap-1 truncate">
                      {u.name}
                      {u.isVerified && (
                        <span className="text-[9px] text-purple-400 font-bold">✓</span>
                      )}
                    </p>
                    <p className="text-[10px] text-zinc-400">@{u.username}</p>
                    <p className="text-[9px] text-purple-400 uppercase font-semibold">
                      Cargo: {u.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleUserVerification(u.id)}
                    className={`p-2 rounded-xl text-xs font-semibold ${
                      u.isVerified
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-600/40'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                    title={u.isVerified ? 'Remover selo' : 'Dar selo verificado'}
                  >
                    <BadgeCheck className="w-4 h-4" />
                  </button>

                  {u.role !== 'admin' && (
                    <button
                      onClick={() => updateUserBan(u.id, !u.isBanned)}
                      className={`p-2 rounded-xl text-xs font-semibold ${
                        u.isBanned
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:text-red-400'
                      }`}
                      title={u.isBanned ? 'Desbanir' : 'Banir usuário'}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
