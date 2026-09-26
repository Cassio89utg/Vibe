import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Send,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  Circle,
  Sparkles
} from 'lucide-react';
import { User, Conversation } from '../types';
import { useSocial } from '../context/SocialContext';

interface MessagesViewProps {
  initialRecipient?: User | null;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

const EMOJIS = ['💜', '🔥', '✨', '⚡️', '😎', '👏', '😂', '🚀', '🙌', '💯'];

export const MessagesView: React.FC<MessagesViewProps> = ({
  initialRecipient,
  onClose,
  onSelectUser
}) => {
  const { conversations, currentUser, getMessages, sendMessage, users } = useSocial();

  const [activeRecipient, setActiveRecipient] = useState<User | null>(initialRecipient || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showEmojiTray, setShowEmojiTray] = useState(false);

  // Find active conversation if one exists
  const activeConversation = conversations.find(
    (c) => c.participant.id === activeRecipient?.id
  );

  const messages = activeConversation ? getMessages(activeConversation.id) : [];

  const filteredConversations = conversations.filter(
    (c) =>
      c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecipient || !inputText.trim()) return;

    sendMessage(activeRecipient.id, inputText.trim());
    setInputText('');
    setShowEmojiTray(false);
  };

  const handleStartNewChat = (user: User) => {
    setActiveRecipient(user);
    setSearchQuery('');
  };

  return (
    <div
      id="messages-view"
      className="fixed inset-0 z-50 bg-black flex flex-col max-w-md mx-auto select-none"
    >
      {/* If looking at active conversation */}
      {activeRecipient ? (
        <div className="flex flex-col h-full bg-zinc-950">
          {/* Chat Header */}
          <div className="p-3 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveRecipient(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div
                onClick={() => onSelectUser(activeRecipient)}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <img
                  src={activeRecipient.avatarUrl}
                  alt={activeRecipient.name}
                  className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    {activeRecipient.name}
                    {activeRecipient.isVerified && (
                      <span className="w-3 h-3 rounded-full bg-purple-500 text-white flex items-center justify-center text-[8px]">
                        ✓
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-purple-400">@{activeRecipient.username}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <Circle className="w-2 h-2 fill-emerald-400" />
              <span>Online</span>
            </div>
          </div>

          {/* Chat Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-2">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-zinc-300">Inicie a conversa!</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Diga oi para @{activeRecipient.username} e compartilhe momentos da sua VIBE.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-md ${
                        isMine
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none'
                      }`}
                    >
                      {msg.mediaUrl && (
                        <img
                          src={msg.mediaUrl}
                          alt="attached media"
                          className="w-full h-36 object-cover rounded-xl mb-1.5"
                        />
                      )}
                      <p>{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[9px] text-zinc-500">{msg.createdAt}</span>
                      {isMine && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3 h-3 text-cyan-400" />
                          ) : msg.status === 'delivered' ? (
                            <CheckCheck className="w-3 h-3 text-zinc-400" />
                          ) : (
                            <Check className="w-3 h-3 text-zinc-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Emoji Tray */}
          {showEmojiTray && (
            <div className="p-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setInputText((prev) => prev + emoji)}
                  className="text-xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-zinc-950 border-t border-zinc-900 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setShowEmojiTray(!showEmojiTray)}
              className="p-2 text-zinc-400 hover:text-purple-400"
            >
              <Smile className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Mensagem..."
              className="flex-1 bg-zinc-900 text-xs text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-full border border-zinc-800 focus:outline-none focus:border-purple-500/70"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-purple-600 text-white disabled:opacity-40 hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Conversations List View */
        <div className="flex flex-col h-full bg-zinc-950">
          {/* Header */}
          <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-extrabold text-white">Mensagens</h2>
            </div>
          </div>

          {/* Search Field */}
          <div className="p-3 border-b border-zinc-900">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar conversas ou amigos..."
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 text-xs text-white placeholder-zinc-500 rounded-xl border border-zinc-800 focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          {/* New message suggestion chips */}
          <div className="p-3 border-b border-zinc-900">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-2">
              Conversar com:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {users
                .filter((u) => u.id !== currentUser?.id)
                .map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleStartNewChat(u)}
                    className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                  >
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/40 group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[10px] text-zinc-300 mt-1 max-w-[50px] truncate text-center">
                      {u.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <p className="text-xs font-semibold text-zinc-400">
                  Nenhuma conversa encontrada
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Selecione um dos criadores acima para iniciar um bate-papo!
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveRecipient(conv.participant)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 cursor-pointer transition-all"
                >
                  <img
                    src={conv.participant.avatarUrl}
                    alt={conv.participant.name}
                    className="w-12 h-12 rounded-full object-cover border border-purple-500/30 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">
                        {conv.participant.name}
                      </h4>
                      <span className="text-[10px] text-zinc-500">
                        {conv.lastMessage?.createdAt || ''}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {conv.lastMessage?.text || 'Iniciar conversa...'}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
