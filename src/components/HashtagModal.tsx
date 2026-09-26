import React, { useState } from 'react';
import { X, Hash, Play, Clock, Sparkles } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { Post } from '../types';

interface HashtagModalProps {
  tag: string;
  onClose: () => void;
  onSelectPost: (post: Post) => void;
}

export const HashtagModal: React.FC<HashtagModalProps> = ({ tag, onClose, onSelectPost }) => {
  const { getActivePosts } = useSocial();
  const [tab, setTab] = useState<'populares' | 'recentes'>('populares');

  const cleanTag = tag.replace('#', '').toLowerCase();
  const activePosts = getActivePosts().filter((p) =>
    p.hashtags.some((t) => t.toLowerCase() === cleanTag)
  );

  const sortedPosts = [...activePosts].sort((a, b) => {
    if (tab === 'populares') {
      return b.likesCount + b.viewsCount - (a.likesCount + a.viewsCount);
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 select-none animate-fade-in">
      <div
        id="hashtag-view"
        className="relative w-full max-w-md h-[90vh] bg-zinc-950 border border-purple-900/50 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">#{cleanTag}</h2>
              <p className="text-xs text-zinc-400">
                {activePosts.length} {activePosts.length === 1 ? 'publicação' : 'publicações'} ativas na VIBE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls: Populares / Recentes */}
        <div className="flex items-center border-b border-zinc-900 bg-zinc-900/40">
          <button
            onClick={() => setTab('populares')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              tab === 'populares'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Populares
          </button>
          <button
            onClick={() => setTab('recentes')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              tab === 'recentes'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Recentes
          </button>
        </div>

        {/* Posts Grid */}
        <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
          {sortedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Hash className="w-12 h-12 text-zinc-600 mb-2" />
              <p className="text-xs font-semibold text-zinc-400">
                Nenhuma publicação encontrada com #{cleanTag}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Seja o primeiro a publicar usando esta hashtag!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    onClose();
                    onSelectPost(post);
                  }}
                  className="relative aspect-[9/14] rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-purple-500/60 transition-all shadow-md group"
                >
                  <img
                    src={post.thumbnailUrl || post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
                    <div className="flex items-center gap-1 text-[9px] text-zinc-400">
                      <Play className="w-2.5 h-2.5 fill-zinc-400" />
                      {post.viewsCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
