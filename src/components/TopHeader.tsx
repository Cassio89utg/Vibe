import React from 'react';
import { Search, Send, Plus, Sparkles, Clock } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { Story } from '../types';

export type FeedTab = 'for_you' | 'following' | '24h' | 'forYou';

interface TopHeaderProps {
  activeFeedTab?: FeedTab;
  activeTab?: FeedTab;
  onChangeFeedTab?: (tab: any) => void;
  onTabChange?: (tab: any) => void;
  onOpenSearch?: () => void;
  onOpenMessages: () => void;
  onOpenPublishStory?: () => void;
  onCreateStory?: () => void;
  onOpenStoryViewer?: (story: Story) => void;
  onOpenStory?: (story: Story) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeFeedTab,
  activeTab,
  onChangeFeedTab,
  onTabChange,
  onOpenSearch,
  onOpenMessages,
  onOpenPublishStory,
  onCreateStory,
  onOpenStoryViewer,
  onOpenStory
}) => {
  const currentTab = activeTab || activeFeedTab || 'for_you';
  const handleTab = (tab: FeedTab) => {
    if (onTabChange) onTabChange(tab);
    if (onChangeFeedTab) onChangeFeedTab(tab);
  };

  const handleOpenStory = (story: Story) => {
    if (onOpenStory) onOpenStory(story);
    if (onOpenStoryViewer) onOpenStoryViewer(story);
  };

  const handleCreateStory = () => {
    if (onCreateStory) onCreateStory();
    if (onOpenPublishStory) onOpenPublishStory();
  };

  const { currentUser, getActiveStories, conversations } = useSocial();
  const activeStories = getActiveStories();

  // Calculate unread direct messages
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Group stories by user so each user has one circle
  const userStoriesMap = new Map<string, Story[]>();
  activeStories.forEach((st) => {
    const list = userStoriesMap.get(st.userId) || [];
    list.push(st);
    userStoriesMap.set(st.userId, list);
  });

  const myStories = currentUser ? userStoriesMap.get(currentUser.id) || [] : [];
  const otherUsersStories = Array.from(userStoriesMap.entries()).filter(
    ([userId]) => userId !== currentUser?.id
  );

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-black via-black/85 to-transparent pb-2 pt-3 px-3 max-w-md mx-auto">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Brand VIBE */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-white bg-clip-text text-transparent">
              VIBE
            </h1>
          </div>
        </div>

        {/* Center Tabs: Para você / Seguindo / 24H */}
        <div className="flex items-center bg-zinc-900/80 p-0.5 rounded-full border border-purple-900/30">
          <button
            id="tab-feed-foryou"
            onClick={() => handleTab('for_you')}
            className={`px-2.5 py-1 text-[11px] rounded-full font-medium transition-all ${
              currentTab === 'for_you' || currentTab === 'forYou'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Para você
          </button>
          <button
            id="tab-feed-following"
            onClick={() => handleTab('following')}
            className={`px-2.5 py-1 text-[11px] rounded-full font-medium transition-all ${
              currentTab === 'following'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Seguindo
          </button>
          <button
            id="tab-feed-24h"
            onClick={() => handleTab('24h')}
            className={`px-2.5 py-1 text-[11px] rounded-full font-medium transition-all flex items-center gap-1 ${
              currentTab === '24h'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3 text-purple-400" />
            24H
          </button>
        </div>

        {/* Action icons: Search & Messages */}
        <div className="flex items-center gap-2">
          {onOpenSearch && (
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-purple-500/50 transition-colors"
              title="Pesquisar"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            id="header-messages-btn"
            onClick={onOpenMessages}
            className="relative p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-purple-500/50 transition-colors"
            title="Mensagens"
          >
            <Send className="w-4 h-4" />
            {totalUnreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-[9px] font-bold text-white flex items-center justify-center border border-black animate-pulse">
                {totalUnreadMessages}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stories Tray */}
      <div
        id="stories-tray"
        className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1"
      >
        {/* Your Story item */}
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
          <div className="relative">
            <div
              onClick={() => {
                if (myStories.length > 0) {
                  handleOpenStory(myStories[0]);
                } else {
                  handleCreateStory();
                }
              }}
              className={`w-14 h-14 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                myStories.length > 0
                  ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400 p-[2px]'
                  : 'border border-dashed border-purple-500/60'
              }`}
            >
              <img
                src={
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                }
                alt="Seu Story"
                className="w-full h-full rounded-full object-cover border-2 border-black"
              />
            </div>
            {/* Plus badge for adding story */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCreateStory();
              }}
              className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center border-2 border-black shadow-[0_0_6px_rgba(168,85,247,0.8)]"
              title="Adicionar Story"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
          <span className="text-[11px] text-zinc-300 mt-1 max-w-[62px] truncate text-center">
            {myStories.length > 0 ? 'Seu Story' : '+ Story'}
          </span>
        </div>

        {/* Stories from other users */}
        {otherUsersStories.map(([userId, userStList]) => {
          const firstStory = userStList[0];
          const hasUnviewed = userStList.some((s) => !s.viewedByCurrentUser);

          return (
            <div
              key={userId}
              id={`story-ring-${userId}`}
              onClick={() => handleOpenStory(firstStory)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            >
              <div
                className={`w-14 h-14 rounded-full p-[2px] transition-transform group-hover:scale-105 ${
                  hasUnviewed
                    ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                    : 'bg-zinc-700'
                }`}
              >
                <img
                  src={firstStory.user.avatarUrl}
                  alt={firstStory.user.name}
                  className="w-full h-full rounded-full object-cover border-2 border-black"
                />
              </div>
              <span className="text-[11px] text-zinc-300 mt-1 max-w-[62px] truncate text-center">
                {firstStory.user.username}
              </span>
            </div>
          );
        })}
      </div>
    </header>
  );
};
