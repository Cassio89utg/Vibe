import React from 'react';
import { Home, Compass, Plus, Heart, User as UserIcon } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

export type NavTab = 'feed' | 'explore' | 'notifications' | 'profile';

interface NavbarProps {
  currentTab?: NavTab;
  activeTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onTabChange?: (tab: NavTab) => void;
  onOpenPublish: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  onTabChange,
  onOpenPublish
}) => {
  const selectedTab = activeTab || currentTab || 'feed';
  const handleTabChange = (tab: NavTab) => {
    if (onTabChange) onTabChange(tab);
    if (onSelectTab) onSelectTab(tab);
  };
  const { notifications, currentUser } = useSocial();
  const unreadNotifsCount = notifications.filter((n) => !n.readAt).length;

  return (
    <nav
      id="bottom-navbar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-purple-950/40 px-3 py-2 max-w-md mx-auto"
    >
      <div className="flex items-center justify-around">
        {/* Início */}
        <button
          id="nav-home-btn"
          onClick={() => handleTabChange('feed')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            selectedTab === 'feed'
              ? 'text-purple-400 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-0.5 tracking-tight">Início</span>
        </button>

        {/* Explorar */}
        <button
          id="nav-explore-btn"
          onClick={() => handleTabChange('explore')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            selectedTab === 'explore'
              ? 'text-purple-400 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Compass className="w-6 h-6" />
          <span className="text-[10px] mt-0.5 tracking-tight">Explorar</span>
        </button>

        {/* Botão Central Publicar (+) */}
        <div className="relative -top-2 flex items-center justify-center px-1">
          <button
            id="nav-publish-btn"
            onClick={onOpenPublish}
            aria-label="Publicar novo conteúdo"
            className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 transition-transform duration-150"
          >
            <Plus className="w-7 h-7 stroke-[2.5] transition-transform group-hover:rotate-90 duration-300" />
            <span className="sr-only">Publicar</span>
          </button>
        </div>

        {/* Notificações */}
        <button
          id="nav-notifications-btn"
          onClick={() => handleTabChange('notifications')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            selectedTab === 'notifications'
              ? 'text-purple-400 font-semibold drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Heart className="w-6 h-6" />
          {unreadNotifsCount > 0 && (
            <span
              id="notif-badge"
              className="absolute top-1.5 right-2 min-w-4 h-4 px-1 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center border border-black"
            >
              {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5 tracking-tight">Notificações</span>
        </button>

        {/* Perfil */}
        <button
          id="nav-profile-btn"
          onClick={() => handleTabChange('profile')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            selectedTab === 'profile'
              ? 'text-purple-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full overflow-hidden border ${
              selectedTab === 'profile' ? 'border-purple-400 ring-2 ring-purple-500/40' : 'border-zinc-600'
            }`}
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-full h-full p-1 bg-zinc-800 text-zinc-300" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
