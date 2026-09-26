import React from 'react';
import { UserPlus, Check, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { useSocial } from '../context/SocialContext';

interface ProfileSuggestionsProps {
  onSelectUser: (user: User) => void;
  maxCount?: number;
}

export const ProfileSuggestions: React.FC<ProfileSuggestionsProps> = ({
  onSelectUser,
  maxCount = 6
}) => {
  const { users, currentUser, isFollowingUser, toggleFollowUser } = useSocial();

  // Filter out current user
  const availableUsers = users.filter((u) => u.id !== currentUser?.id);

  // Pick up to maxCount suggestions
  const suggestedUsers = availableUsers.slice(0, maxCount);

  if (suggestedUsers.length === 0) return null;

  return (
    <div id="profile-suggestions-widget" className="rounded-2xl bg-gradient-to-b from-purple-950/20 to-zinc-900/50 border border-purple-900/30 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">
              Sugestões de Perfis
            </h3>
            <p className="text-[10px] text-zinc-400">
              Conecte-se com novos criadores na VIBE
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {suggestedUsers.map((creator) => {
          const isFollowed = isFollowingUser(creator.id);
          return (
            <div
              key={creator.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-purple-500/40 transition-all group"
            >
              <div
                onClick={() => onSelectUser(creator)}
                className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1 mr-2"
              >
                <div className="relative w-10 h-10 rounded-full flex-shrink-0">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.name}
                    className="w-full h-full rounded-full object-cover border border-purple-500/40 group-hover:border-purple-400 transition-colors"
                  />
                  {creator.isVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[7px] border border-black shadow">
                      ✓
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors flex items-center gap-1">
                    {creator.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    @{creator.username}
                  </p>
                  <p className="text-[9px] text-purple-400/90 truncate flex items-center gap-1 mt-0.5">
                    {creator.followersCount > 10000 ? (
                      <>
                        <Flame className="w-2.5 h-2.5 text-pink-400 inline" /> Em alta
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-2.5 h-2.5 text-purple-400 inline" /> Criador ativo
                      </>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowUser(creator.id);
                }}
                className={`text-[11px] px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all flex-shrink-0 active:scale-95 ${
                  isFollowed
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700/60'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                }`}
                title={isFollowed ? 'Deixar de seguir' : 'Seguir perfil'}
              >
                {isFollowed ? (
                  <>
                    <Check className="w-3 h-3 text-purple-400" />
                    <span>Seguindo</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Seguir</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
