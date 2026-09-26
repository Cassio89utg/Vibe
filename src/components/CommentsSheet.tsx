import React, { useState } from 'react';
import { X, Heart, Send, Trash2, Flag, CornerDownRight } from 'lucide-react';
import { Post, User } from '../types';
import { useSocial } from '../context/SocialContext';

interface CommentsSheetProps {
  post: Post | null;
  onClose: () => void;
  onReportComment?: (commentId: string) => void;
  onSelectUser?: (user: User) => void;
}

export const CommentsSheet: React.FC<CommentsSheetProps> = ({
  post,
  onClose,
  onReportComment,
  onSelectUser
}) => {
  const {
    currentUser,
    getCommentsForPost,
    addComment,
    deleteComment,
    toggleLikeComment
  } = useSocial();

  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  if (!post) return null;

  const comments = getCommentsForPost(post.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const prefix = replyingTo ? `@${replyingTo} ` : '';
    addComment(post.id, prefix + newCommentText);
    setNewCommentText('');
    setReplyingTo(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Container */}
      <div
        id="comments-bottom-sheet"
        className="relative z-10 w-full max-w-md h-[72vh] max-h-[640px] bg-zinc-950 border-t border-purple-900/40 rounded-t-3xl flex flex-col shadow-2xl overflow-hidden animate-slide-up"
      >
        {/* Drag handle & Header */}
        <div className="flex flex-col items-center pt-2.5 pb-2 px-4 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md">
          <div className="w-10 h-1 rounded-full bg-zinc-700 mb-2" />
          <div className="flex items-center justify-between w-full">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Comentários ({comments.length})
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-12 h-12 rounded-full bg-purple-950/50 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-3">
                💬
              </div>
              <p className="text-sm font-semibold text-zinc-300">
                Nenhum comentário ainda
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Seja o primeiro a compartilhar sua VIBE sobre este conteúdo!
              </p>
            </div>
          ) : (
            comments.map((comment) => {
              const isOwn = currentUser?.id === comment.userId;
              return (
                <div key={comment.id} className="flex items-start gap-3 group">
                  {/* User Avatar */}
                  <img
                    src={comment.user.avatarUrl}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full object-cover border border-purple-900/50 flex-shrink-0"
                  />

                  {/* Comment Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200">
                        @{comment.user.username}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {comment.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed break-words">
                      {comment.text}
                    </p>

                    {/* Comment Actions: Reply, Delete, Report */}
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-500">
                      <button
                        onClick={() => {
                          setReplyingTo(comment.user.username);
                        }}
                        className="hover:text-purple-400 font-medium flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        Responder
                      </button>

                      {isOwn ? (
                        <button
                          onClick={() => deleteComment(post.id, comment.id)}
                          className="hover:text-red-400 flex items-center gap-1"
                          title="Excluir meu comentário"
                        >
                          <Trash2 className="w-3 h-3" />
                          Excluir
                        </button>
                      ) : (
                        <button
                          onClick={() => onReportComment?.(comment.id)}
                          className="hover:text-zinc-300 flex items-center gap-1"
                          title="Denunciar comentário"
                        >
                          <Flag className="w-3 h-3" />
                          Denunciar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Like comment button */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => toggleLikeComment(post.id, comment.id)}
                      className={`p-1 transition-colors ${
                        comment.isLiked ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-pink-500' : ''}`}
                      />
                    </button>
                    {comment.likesCount > 0 && (
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {comment.likesCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Replying Banner if active */}
        {replyingTo && (
          <div className="flex items-center justify-between px-4 py-1.5 bg-purple-950/40 border-t border-purple-900/30 text-xs text-purple-300">
            <span>Respondendo a @{replyingTo}</span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Sticky Input Footer */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-zinc-950 border-t border-zinc-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={
              replyingTo ? `Respondendo a @${replyingTo}...` : 'Adicione um comentário...'
            }
            className="flex-1 bg-zinc-900/90 text-xs text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-full border border-zinc-800 focus:outline-none focus:border-purple-500/70"
          />

          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="p-2.5 rounded-full bg-purple-600 text-white disabled:opacity-40 disabled:hover:bg-purple-600 hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
