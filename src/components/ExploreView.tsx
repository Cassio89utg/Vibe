import React, { useState } from 'react';
import { Search, TrendingUp, Users, Hash, Play, Clock, Sparkles } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { EXPLORE_CATEGORIES, POPULAR_HASHTAGS } from '../data/mockData';
import { Post, User } from '../types';
import { ProfileSuggestions } from './ProfileSuggestions';

interface ExploreViewProps {
  onSelectPost: (post: Post) => void;
  onSelectUser: (user: User) => void;
  onSelectHashtag: (tag: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectPost,
  onSelectUser,
  onSelectHashtag
}) => {
  const { users, getActivePosts, toggleFollowUser, isFollowingUser, currentUser } = useSocial();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Em alta');
  const [searchTab, setSearchTab] = useState<'people' | 'videos' | 'hashtags'>('videos');

  const activePosts = getActivePosts();
  const queryClean = searchQuery.toLowerCase().trim().replace('#', '');

  // Filtered Results
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(queryClean) ||
      u.username.toLowerCase().includes(queryClean) ||
      u.bio.toLowerCase().includes(queryClean)
  );

  const filteredPosts = activePosts.filter((p) => {
    if (!queryClean) return true;
    const matchCaption = p.caption.toLowerCase().includes(queryClean);
    const matchTag = p.hashtags.some((t) => t.toLowerCase().includes(queryClean));
    const matchUser = p.user.username.toLowerCase().includes(queryClean);
    return matchCaption || matchTag || matchUser;
  });

  const matchingHashtags = POPULAR_HASHTAGS.filter((h) =>
    h.tag.toLowerCase().includes(queryClean)
  );

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div id="explore-view" className="flex flex-col min-h-screen bg-black pb-24 max-w-md mx-auto">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md px-3 pt-3 pb-2 border-b border-zinc-900">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar pessoas, vídeos ou hashtags"
            className="w-full pl-10 pr-9 py-2.5 bg-zinc-900/90 text-xs text-white placeholder-zinc-500 rounded-2xl border border-zinc-800 focus:outline-none focus:border-purple-500/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-zinc-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Search Result Tabs when active search */}
        {isSearching && (
          <div className="flex items-center justify-around mt-2 pt-1 border-t border-zinc-900">
            <button
              onClick={() => setSearchTab('videos')}
              className={`text-xs py-1.5 px-3 font-semibold border-b-2 transition-all ${
                searchTab === 'videos'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Vídeos ({filteredPosts.length})
            </button>
            <button
              onClick={() => setSearchTab('people')}
              className={`text-xs py-1.5 px-3 font-semibold border-b-2 transition-all ${
                searchTab === 'people'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Pessoas ({filteredUsers.length})
            </button>
            <button
              onClick={() => setSearchTab('hashtags')}
              className={`text-xs py-1.5 px-3 font-semibold border-b-2 transition-all ${
                searchTab === 'hashtags'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Hashtags
            </button>
          </div>
        )}

        {/* Category horizontal chips when not actively searching */}
        {!isSearching && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2">
            {EXPLORE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-3">
        {/* If Searching: Show Results according to active tab */}
        {isSearching ? (
          <div>
            {searchTab === 'videos' && (
              <div className="grid grid-cols-2 gap-2">
                {filteredPosts.length === 0 ? (
                  <p className="col-span-2 text-center text-xs text-zinc-500 py-10">
                    Não encontramos vídeos para "{searchQuery}".
                  </p>
                ) : (
                  filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => onSelectPost(post)}
                      className="relative aspect-[9/14] rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 group border border-zinc-900 hover:border-purple-500/50 transition-all"
                    >
                      <img
                        src={post.thumbnailUrl || post.mediaUrl}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {post.category === '24h' && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-[9px] font-bold text-purple-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-400" />
                          24H
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[11px] font-bold text-white truncate">
                          @{post.user.username}
                        </p>
                        <p className="text-[10px] text-zinc-300 line-clamp-1">
                          {post.caption}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 text-[9px] text-zinc-400">
                          <Play className="w-2.5 h-2.5 fill-zinc-400" />
                          {post.viewsCount} visualizações
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {searchTab === 'people' && (
              <div className="space-y-2">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-xs text-zinc-500 py-10">
                    Nenhum usuário encontrado para "{searchQuery}".
                  </p>
                ) : (
                  filteredUsers.map((user) => {
                    const isFollowed = isFollowingUser(user.id);
                    const isSelf = currentUser?.id === user.id;
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800"
                      >
                        <div
                          onClick={() => onSelectUser(user)}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        >
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover border border-purple-900/50"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white flex items-center gap-1 truncate">
                              {user.name}
                              {user.isVerified && (
                                <span className="w-3 h-3 rounded-full bg-purple-500 text-white flex items-center justify-center text-[8px]">
                                  ✓
                                </span>
                              )}
                            </h4>
                            <p className="text-[11px] text-purple-400">@{user.username}</p>
                            <p className="text-[10px] text-zinc-400 truncate max-w-[180px]">
                              {user.bio}
                            </p>
                          </div>
                        </div>

                        {!isSelf && (
                          <button
                            onClick={() => toggleFollowUser(user.id)}
                            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                              isFollowed
                                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                : 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                            }`}
                          >
                            {isFollowed ? 'Seguindo' : 'Seguir'}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {searchTab === 'hashtags' && (
              <div className="space-y-2">
                {matchingHashtags.length === 0 ? (
                  <p className="text-center text-xs text-zinc-500 py-10">
                    Nenhuma hashtag encontrada.
                  </p>
                ) : (
                  matchingHashtags.map((h) => (
                    <div
                      key={h.tag}
                      onClick={() => onSelectHashtag(h.tag)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400">
                          <Hash className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">#{h.tag}</p>
                          <p className="text-[10px] text-zinc-400">
                            {h.count} publicações
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-purple-400 font-semibold">Ver</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          /* Default Explore View: Trending, Creators, Grid */
          <div className="space-y-5">
            {/* Trending Hashtags row */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Tendências em Alta
                </h3>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {POPULAR_HASHTAGS.slice(0, 5).map((h) => (
                  <button
                    key={h.tag}
                    onClick={() => onSelectHashtag(h.tag)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-purple-900/30 hover:border-purple-500/60 transition-all flex-shrink-0"
                  >
                    <span className="text-xs font-bold text-purple-300">#{h.tag}</span>
                    <span className="text-[10px] text-zinc-500">{h.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sugestões de Perfis Widget */}
            <ProfileSuggestions onSelectUser={onSelectUser} />

            {/* Recommended Creators */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Criadores Recomendados
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {users
                  .filter((u) => u.id !== currentUser?.id)
                  .map((creator) => {
                    const isFollowed = isFollowingUser(creator.id);
                    return (
                      <div
                        key={creator.id}
                        className="flex flex-col items-center p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex-shrink-0 w-32 text-center"
                      >
                        <div
                          onClick={() => onSelectUser(creator)}
                          className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/40 mb-2 cursor-pointer hover:scale-105 transition-transform"
                        >
                          <img
                            src={creator.avatarUrl}
                            alt={creator.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4
                          onClick={() => onSelectUser(creator)}
                          className="text-xs font-bold text-white truncate w-full cursor-pointer"
                        >
                          {creator.name}
                        </h4>
                        <p className="text-[10px] text-zinc-400 truncate w-full mb-2">
                          @{creator.username}
                        </p>
                        <button
                          onClick={() => toggleFollowUser(creator.id)}
                          className={`w-full text-[11px] py-1 rounded-xl font-semibold transition-all ${
                            isFollowed
                              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              : 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                          }`}
                        >
                          {isFollowed ? 'Seguindo' : 'Seguir'}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Explore Video Masonry Grid */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Descobrir Vídeos
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {activePosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="relative aspect-[9/14] rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 group border border-zinc-900 hover:border-purple-500/50 transition-all shadow-md"
                  >
                    <img
                      src={post.thumbnailUrl || post.mediaUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {post.category === '24h' && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-[9px] font-bold text-purple-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        24H
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-[11px] font-bold text-white truncate">
                        @{post.user.username}
                      </p>
                      <p className="text-[10px] text-zinc-300 line-clamp-1">
                        {post.caption}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-[9px] text-zinc-400">
                        <Play className="w-2.5 h-2.5 fill-zinc-400" />
                        {post.viewsCount} views
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
