import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  CircleDot,
  Send,
  CheckCheck,
  Bell
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { Notification, NotificationType, User } from '../types';

interface NotificationsViewProps {
  onSelectUser: (user: User) => void;
}

const CATEGORIES: { label: string; value: 'all' | NotificationType }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Curtidas', value: 'like' },
  { label: 'Comentários', value: 'comment' },
  { label: 'Seguidores', value: 'follow' },
  { label: 'Menções', value: 'mention' },
  { label: 'Stories', value: 'story' },
  { label: 'Mensagens', value: 'message' }
];

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onSelectUser }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleFollowUser,
    isFollowingUser
  } = useSocial();

  const [selectedFilter, setSelectedFilter] = useState<'all' | NotificationType>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === 'all') return true;
    return n.type === selectedFilter;
  });

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-purple-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-indigo-400" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-cyan-400" />;
      case 'story':
        return <CircleDot className="w-4 h-4 text-yellow-400" />;
      case 'message':
        return <Send className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div
      id="notifications-view"
      className="flex flex-col min-h-screen bg-black pb-24 max-w-md mx-auto select-none"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md px-4 pt-4 pb-2 border-b border-zinc-900 flex items-center justify-between">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-400" />
          Notificações
        </h2>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Marcar lidas
        </button>
      </div>

      {/* Category Pills */}
      <div className="px-3 py-2 border-b border-zinc-900 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedFilter(cat.value)}
            className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedFilter === cat.value
                ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="p-3 space-y-2 flex-1">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell className="w-12 h-12 text-zinc-700 mb-2" />
            <p className="text-xs font-bold text-zinc-400">Tudo calmo por aqui!</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Você não tem notificações nesta categoria no momento.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isRead = !!notif.readAt;
            const isFollowed = isFollowingUser(notif.actorId);

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                  isRead
                    ? 'bg-zinc-950/60 border-zinc-900'
                    : 'bg-zinc-900/80 border-purple-900/50 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                }`}
              >
                {/* User Avatar with type badge */}
                <div
                  className="relative flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectUser(notif.actor);
                  }}
                >
                  <img
                    src={notif.actor.avatarUrl}
                    alt={notif.actor.name}
                    className="w-11 h-11 rounded-full object-cover border border-purple-500/40"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-zinc-950 border border-zinc-800 shadow">
                    {getIconForType(notif.type)}
                  </div>
                </div>

                {/* Notification Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUser(notif.actor);
                      }}
                      className="font-bold text-white hover:text-purple-300 mr-1"
                    >
                      {notif.actor.name}
                    </span>
                    <span className="text-zinc-300">{notif.referenceText}</span>
                  </p>
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">
                    {notif.createdAt}
                  </span>
                </div>

                {/* Follow back button if type is follow */}
                {notif.type === 'follow' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowUser(notif.actorId);
                    }}
                    className={`text-[11px] px-3 py-1 rounded-xl font-semibold transition-all ${
                      isFollowed
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-purple-600 text-white shadow-sm'
                    }`}
                  >
                    {isFollowed ? 'Seguindo' : 'Seguir'}
                  </button>
                )}

                {/* Unread indicator dot */}
                {!isRead && (
                  <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
