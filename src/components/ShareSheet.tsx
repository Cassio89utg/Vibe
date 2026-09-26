import React, { useState } from 'react';
import { X, Copy, Check, Share, Bookmark, Flag, Send } from 'lucide-react';
import { Post } from '../types';
import { useSocial } from '../context/SocialContext';

interface ShareSheetProps {
  post: Post | null;
  onClose: () => void;
  onOpenReport: (post: Post) => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({
  post,
  onClose,
  onOpenReport
}) => {
  const { users, currentUser, sendMessage, toggleSavePost } = useSocial();
  const [copied, setCopied] = useState(false);
  const [sentUserIds, setSentUserIds] = useState<string[]>([]);

  if (!post) return null;

  const shareableUrl = `https://vibe.app/p/${post.id}`;
  const friends = users.filter((u) => u.id !== currentUser?.id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendToUser = (receiverId: string) => {
    sendMessage(
      receiverId,
      `Confira este vídeo de @${post.user.username} na VIBE! ${shareableUrl}`,
      post.thumbnailUrl || post.mediaUrl
    );
    setSentUserIds((prev) => [...prev, receiverId]);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `VIBE - @${post.user.username}`,
          text: post.caption,
          url: shareableUrl
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        id="share-bottom-sheet"
        className="relative z-10 w-full max-w-md bg-zinc-950 border-t border-purple-900/40 rounded-t-3xl p-4 shadow-2xl flex flex-col gap-4 animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Compartilhar Publicação
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Send to Friends */}
        <div>
          <span className="text-xs text-zinc-400 font-semibold mb-3 block">
            Enviar para amigos na VIBE
          </span>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {friends.map((friend) => {
              const isSent = sentUserIds.includes(friend.id);
              return (
                <div
                  key={friend.id}
                  onClick={() => !isSent && handleSendToUser(friend.id)}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-purple-500/40 group-hover:scale-105 transition-transform">
                    <img
                      src={friend.avatarUrl}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                    {isSent && (
                      <div className="absolute inset-0 bg-purple-900/80 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-300 mt-1 max-w-[54px] truncate text-center">
                    {friend.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-purple-400">
                    {isSent ? 'Enviado' : 'Enviar'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Grid Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-900">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-all text-zinc-300 hover:text-white"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-purple-900/40 flex items-center justify-center text-purple-400">
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-medium text-center">
              {copied ? 'Copiado!' : 'Copiar link'}
            </span>
          </button>

          {/* External Share */}
          <button
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-all text-zinc-300 hover:text-white"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-purple-900/40 flex items-center justify-center text-pink-400">
              <Share className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-center">Compartilhar</span>
          </button>

          {/* Save / Bookmark */}
          <button
            onClick={() => {
              toggleSavePost(post.id);
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-all text-zinc-300 hover:text-white"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-purple-900/40 flex items-center justify-center text-yellow-400">
              <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-yellow-400' : ''}`} />
            </div>
            <span className="text-[10px] font-medium text-center">
              {post.isSaved ? 'Salvo' : 'Salvar'}
            </span>
          </button>

          {/* Report */}
          <button
            onClick={() => {
              onClose();
              onOpenReport(post);
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-all text-zinc-300 hover:text-white"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-400">
              <Flag className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-center">Denunciar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
