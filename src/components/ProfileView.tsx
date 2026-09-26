import React, { useState } from 'react';
import {
  Settings,
  Edit3,
  Share2,
  MessageCircle,
  Lock,
  Grid,
  Video,
  Clock,
  Bookmark,
  ShieldAlert,
  UserPlus,
  UserCheck,
  Play,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { User, Post } from '../types';
import { useSocial } from '../context/SocialContext';

interface ProfileViewProps {
  user: User;
  onOpenSettings: () => void;
  onOpenEditProfile: () => void;
  onOpenAdmin: () => void;
  onOpenMessagesWithUser: (user: User) => void;
  onSelectPost: (post: Post) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onOpenSettings,
  onOpenEditProfile,
  onOpenAdmin,
  onOpenMessagesWithUser,
  onSelectPost
}) => {
  const {
    currentUser,
    getActivePosts,
    toggleFollowUser,
    isFollowingUser,
    formatRemainingTime,
    users
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'posts' | 'videos' | '24h' | 'saved'>('posts');
  const [showFollowModal, setShowFollowModal] = useState<'followers' | 'following' | null>(null);
  const [followSearch, setFollowSearch] = useState('');

  const isSelf = currentUser?.id === user.id;
  const isFollowed = isFollowingUser(user.id);
  const activePosts = getActivePosts();

  // Filter posts by this user
  const userPosts = activePosts.filter((p) => p.userId === user.id);
  const permanentPosts = userPosts.filter((p) => p.category === 'permanent');
  const videoPosts = userPosts.filter((p) => p.type === 'video');
  const temp24hPosts = userPosts.filter((p) => p.category === '24h');
  const savedPosts = isSelf ? activePosts.filter((p) => p.isSaved) : [];

  // Check if private and locked
  const isLocked = user.isPrivate && !isSelf && !isFollowed;

  const currentTabPosts = () => {
    switch (activeTab) {
      case 'posts':
        return permanentPosts;
      case 'videos':
        return videoPosts;
      case '24h':
        return temp24hPosts;
      case 'saved':
        return savedPosts;
      default:
        return permanentPosts;
    }
  };

  const handleShareProfile = () => {
    const url = `https://vibe.app/@${user.username}`;
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${user.name} na VIBE`,
        text: user.bio,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Link do perfil copiado para a área de transferência!');
    }
  };

  const displayList = currentTabPosts();

  // Mock list of followers/following
  const followModalUsers = users.filter((u) => {
    if (u.id === user.id) return false;
    if (!followSearch) return true;
    return (
      u.name.toLowerCase().includes(followSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(followSearch.toLowerCase())
    );
  });

  return (
    <div id="profile-view" className="flex flex-col min-h-screen bg-black pb-24 max-w-md mx-auto">
      {/* Top Profile Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-zinc-900">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-extrabold text-white">@{user.username}</span>
          {user.isVerified && (
            <span className="w-3.5 h-3.5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px] font-bold">
              ✓
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Admin link if user is admin */}
          {isSelf && currentUser?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-400 hover:text-white transition-colors"
              title="Painel Administrativo"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}

          {isSelf ? (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
              title="Configurações"
            >
              <Settings className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleShareProfile}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
              title="Compartilhar Perfil"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* User Info Section */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-5">
          {/* Avatar with Glow */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full rounded-full object-cover border-2 border-black"
              />
            </div>
          </div>

          {/* Social Stats: Posts, Followers, Following */}
          <div className="flex-1 flex items-center justify-around text-center">
            <div>
              <p className="text-base font-extrabold text-white">
                {userPosts.length}
              </p>
              <p className="text-[11px] text-zinc-400">Publicações</p>
            </div>
            <div
              onClick={() => setShowFollowModal('followers')}
              className="cursor-pointer hover:opacity-80"
            >
              <p className="text-base font-extrabold text-white">
                {user.followersCount > 999
                  ? `${(user.followersCount / 1000).toFixed(1)}k`
                  : user.followersCount}
              </p>
              <p className="text-[11px] text-zinc-400">Seguidores</p>
            </div>
            <div
              onClick={() => setShowFollowModal('following')}
              className="cursor-pointer hover:opacity-80"
            >
              <p className="text-base font-extrabold text-white">
                {user.followingCount}
              </p>
              <p className="text-[11px] text-zinc-400">Seguindo</p>
            </div>
          </div>
        </div>

        {/* Name and Bio */}
        <div className="mt-3">
          <h2 className="text-sm font-bold text-white">{user.name}</h2>
          <p className="text-xs text-zinc-300 mt-1 leading-relaxed whitespace-pre-line">
            {user.bio}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          {isSelf ? (
            <>
              <button
                onClick={onOpenEditProfile}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editar perfil
              </button>
              <button
                onClick={handleShareProfile}
                className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => toggleFollowUser(user.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isFollowed
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                }`}
              >
                {isFollowed ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    Seguindo
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    {user.isPrivate ? 'Solicitar' : 'Seguir'}
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenMessagesWithUser(user)}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Mensagem
              </button>

              <button
                onClick={handleShareProfile}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Content Tabs */}
      {isLocked ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-t border-zinc-900 mt-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-white">Esta conta é privada</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
            Siga esta conta para ver suas publicações, vídeos e conteúdos temporários de 24h.
          </p>
        </div>
      ) : (
        <>
          {/* Tabs Bar */}
          <div className="flex items-center justify-around border-t border-b border-zinc-900 mt-4 bg-zinc-950">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'posts'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Grid className="w-4 h-4 mb-1" />
              <span>Publicações</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'videos'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Video className="w-4 h-4 mb-1" />
              <span>Vídeos</span>
            </button>

            {/* TAB 24H: Signature VIBE Feature */}
            <button
              onClick={() => setActiveTab('24h')}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === '24h'
                  ? 'border-purple-500 text-purple-400 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <Clock className="w-4 h-4 mb-1 text-purple-400" />
                {temp24hPosts.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                )}
              </div>
              <span className="flex items-center gap-0.5">
                24H ({temp24hPosts.length})
              </span>
            </button>

            {isSelf && (
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 flex flex-col items-center py-3 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'saved'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Bookmark className="w-4 h-4 mb-1" />
                <span>Salvos</span>
              </button>
            )}
          </div>

          {/* Grid of Posts */}
          <div className="p-1">
            {displayList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-2">
                  {activeTab === '24h' ? (
                    <Clock className="w-6 h-6 text-purple-400" />
                  ) : (
                    <Grid className="w-6 h-6" />
                  )}
                </div>
                <p className="text-xs font-bold text-zinc-300">
                  {activeTab === '24h'
                    ? 'Nenhuma publicação 24h ativa no momento'
                    : 'Você ainda não publicou nada nesta aba'}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[220px]">
                  {activeTab === '24h'
                    ? 'As publicações de 24h somem automaticamente após 1 dia.'
                    : 'Compartilhe sua vida e crie sua primeira VIBE.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {displayList.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="relative aspect-square bg-zinc-900 overflow-hidden cursor-pointer group hover:opacity-90 transition-all rounded-lg"
                  >
                    <img
                      src={post.thumbnailUrl || post.mediaUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* 24H Badge overlay */}
                    {post.category === '24h' && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-purple-500/50 flex items-center gap-1 text-[8px] font-bold text-purple-300">
                        <Clock className="w-2.5 h-2.5 text-purple-400" />
                        {formatRemainingTime(post.expiresAt)}
                      </div>
                    )}

                    {post.type === 'video' && (
                      <div className="absolute bottom-1 right-1 p-0.5 rounded bg-black/60 text-white">
                        <Play className="w-3 h-3 fill-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Followers / Following Modal */}
      {showFollowModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
          <div className="w-full max-w-md h-[70vh] bg-zinc-950 border border-purple-900/40 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white capitalize">
                {showFollowModal === 'followers' ? 'Seguidores' : 'Seguindo'}
              </h3>
              <button
                onClick={() => setShowFollowModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search within list */}
            <div className="p-3 border-b border-zinc-900">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={followSearch}
                  onChange={(e) => setFollowSearch(e.target.value)}
                  placeholder="Pesquisar..."
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 text-xs text-white rounded-xl border border-zinc-800 focus:outline-none focus:border-purple-500/60"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
              {followModalUsers.map((u) => {
                const isF = isFollowingUser(u.id);
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-zinc-800"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">@{u.username}</p>
                        <p className="text-[10px] text-zinc-400">{u.name}</p>
                      </div>
                    </div>
                    {currentUser?.id !== u.id && (
                      <button
                        onClick={() => toggleFollowUser(u.id)}
                        className={`text-[11px] px-3 py-1 rounded-lg font-medium transition-all ${
                          isF
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-purple-600 text-white shadow-sm'
                        }`}
                      >
                        {isF ? 'Seguindo' : 'Seguir'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
