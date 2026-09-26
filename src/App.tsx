import React, { useState, useRef, useEffect } from 'react';
import { SocialProvider, useSocial } from './context/SocialContext';
import { Navbar, NavTab } from './components/Navbar';
import { TopHeader, FeedTab } from './components/TopHeader';
import { VideoCard } from './components/VideoCard';
import { CommentsSheet } from './components/CommentsSheet';
import { ShareSheet } from './components/ShareSheet';
import { StoryViewer } from './components/StoryViewer';
import { PublishModal } from './components/PublishModal';
import { ExploreView } from './components/ExploreView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { EditProfileModal } from './components/EditProfileModal';
import { ReportModal } from './components/ReportModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MessagesView } from './components/MessagesView';
import { HashtagModal } from './components/HashtagModal';
import { AuthModal } from './components/AuthModal';
import { Post, Story, User } from './types';
import { ChevronUp, ChevronDown, Clock, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    getActivePosts,
    isFollowingUser,
    activeFeedTab,
    setActiveFeedTab
  } = useSocial();

  // Navigation State
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('feed');

  // Modals & Sheets
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [commentPost, setCommentPost] = useState<Post | null>(null);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [reportPost, setReportPost] = useState<Post | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [directMessageUser, setDirectMessageUser] = useState<User | null>(null);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Feed active video index
  const [activePostIndex, setActivePostIndex] = useState(0);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Filter posts based on active feed tab: "for_you" | "following" | "24h"
  const allActivePosts = getActivePosts();

  const filteredFeedPosts = allActivePosts.filter((p) => {
    if (activeFeedTab === '24h') {
      return p.category === '24h';
    }
    if (activeFeedTab === 'following') {
      return isFollowingUser(p.userId) || p.userId === currentUser?.id;
    }
    return true; // 'for_you'
  });

  // Handle scroll detection in feed to know active video
  const handleFeedScroll = () => {
    if (!feedContainerRef.current) return;
    const container = feedContainerRef.current;
    const itemHeight = container.clientHeight;
    if (itemHeight <= 0) return;
    const newIndex = Math.round(container.scrollTop / itemHeight);
    if (newIndex !== activePostIndex && newIndex >= 0 && newIndex < filteredFeedPosts.length) {
      setActivePostIndex(newIndex);
    }
  };

  const scrollToPost = (index: number) => {
    if (!feedContainerRef.current) return;
    const container = feedContainerRef.current;
    const itemHeight = container.clientHeight;
    container.scrollTo({
      top: index * itemHeight,
      behavior: 'smooth'
    });
    setActivePostIndex(index);
  };

  // Keyboard navigation for desktop testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeNavTab !== 'feed' || commentPost || sharePost || activeStory || showPublishModal) {
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activePostIndex < filteredFeedPosts.length - 1) {
          scrollToPost(activePostIndex + 1);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activePostIndex > 0) {
          scrollToPost(activePostIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNavTab, activePostIndex, filteredFeedPosts.length, commentPost, sharePost, activeStory, showPublishModal]);

  // Handle navigation helpers
  const handleSelectUser = (user: User) => {
    setViewedUser(user);
    setActiveNavTab('profile');
  };

  const handleSelectPostFromExplore = (post: Post) => {
    setActiveNavTab('feed');
    // Find index in filtered posts or switch tab
    const idx = filteredFeedPosts.findIndex((p) => p.id === post.id);
    if (idx >= 0) {
      setTimeout(() => scrollToPost(idx), 100);
    } else {
      if (post.category === '24h') {
        setActiveFeedTab('24h');
      } else {
        setActiveFeedTab('for_you');
      }
      setTimeout(() => scrollToPost(0), 100);
    }
  };

  const handleOpenMessagesWithUser = (user: User) => {
    setDirectMessageUser(user);
    setShowMessages(true);
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white font-sans overflow-x-hidden flex justify-center">
      {/* Mobile-first Constrained Wrapper (max 480px) */}
      <div className="relative w-full max-w-[480px] min-h-screen bg-zinc-950 flex flex-col shadow-2xl border-x border-zinc-900/80">
        {/* VIEW: FEED */}
        {activeNavTab === 'feed' && (
          <div className="relative w-full h-[100dvh] flex flex-col overflow-hidden">
            {/* Sticky Header with Logo, Tabs, and Stories tray */}
            <TopHeader
              activeTab={activeFeedTab}
              onTabChange={(tab: FeedTab) => {
                const norm: 'for_you' | 'following' | '24h' =
                  tab === 'forYou' ? 'for_you' : tab;
                setActiveFeedTab(norm);
                setActivePostIndex(0);
                feedContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenStory={(story: Story) => setActiveStory(story)}
              onOpenMessages={() => {
                setDirectMessageUser(null);
                setShowMessages(true);
              }}
              onCreateStory={() => setShowPublishModal(true)}
            />

            {/* Desktop Navigation Helper Arrows */}
            {filteredFeedPosts.length > 1 && (
              <div className="hidden sm:flex absolute right-4 bottom-24 z-30 flex-col gap-2">
                <button
                  onClick={() => scrollToPost(Math.max(0, activePostIndex - 1))}
                  disabled={activePostIndex === 0}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/90 disabled:opacity-30 transition-all"
                  title="Vídeo anterior (Seta para cima)"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    scrollToPost(Math.min(filteredFeedPosts.length - 1, activePostIndex + 1))
                  }
                  disabled={activePostIndex === filteredFeedPosts.length - 1}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/90 disabled:opacity-30 transition-all"
                  title="Próximo vídeo (Seta para baixo)"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* 24H Feed Info Banner */}
            {activeFeedTab === '24h' && (
              <div className="absolute top-36 inset-x-4 z-20 pointer-events-none flex justify-center">
                <div className="px-3.5 py-1 rounded-full bg-purple-950/90 border border-purple-500/50 backdrop-blur-md text-[11px] font-bold text-purple-200 flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-fade-in">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Feed Exclusivo 24H — Publicações temporárias ativas
                </div>
              </div>
            )}

            {/* Video Feed Snap Scroll Container */}
            <div
              id="feed-snap-container"
              ref={feedContainerRef}
              onScroll={handleFeedScroll}
              className="flex-1 w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
              style={{ scrollSnapType: 'y mandatory' }}
            >
              {filteredFeedPosts.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-zinc-950">
                  <div className="w-16 h-16 rounded-3xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-3 shadow-lg">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white">Nenhum conteúdo no momento</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-[240px]">
                    {activeFeedTab === '24h'
                      ? 'Nenhuma publicação de 24h ativa. Seja o primeiro a criar um post temporário!'
                      : activeFeedTab === 'following'
                      ? 'Você ainda não segue criadores com publicações recentes. Explore novos perfis!'
                      : 'Nenhuma publicação encontrada.'}
                  </p>
                  <button
                    onClick={() => setShowPublishModal(true)}
                    className="mt-4 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
                  >
                    Publicar Agora
                  </button>
                </div>
              ) : (
                filteredFeedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="w-full h-full snap-start snap-always relative flex-shrink-0"
                    style={{ height: '100%' }}
                  >
                    <VideoCard
                      post={post}
                      isActive={index === activePostIndex}
                      onCommentClick={() => setCommentPost(post)}
                      onShareClick={() => setSharePost(post)}
                      onUserClick={() => handleSelectUser(post.user)}
                      onHashtagClick={(tag: string) => setSelectedHashtag(tag)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW: EXPLORE */}
        {activeNavTab === 'explore' && (
          <ExploreView
            onSelectPost={handleSelectPostFromExplore}
            onSelectUser={handleSelectUser}
            onSelectHashtag={(tag: string) => setSelectedHashtag(tag)}
          />
        )}

        {/* VIEW: NOTIFICATIONS */}
        {activeNavTab === 'notifications' && (
          <NotificationsView onSelectUser={handleSelectUser} />
        )}

        {/* VIEW: PROFILE */}
        {activeNavTab === 'profile' && (
          <ProfileView
            user={viewedUser || currentUser!}
            onOpenSettings={() => setShowSettings(true)}
            onOpenEditProfile={() => setShowEditProfile(true)}
            onOpenAdmin={() => setShowAdminDashboard(true)}
            onOpenMessagesWithUser={handleOpenMessagesWithUser}
            onSelectPost={handleSelectPostFromExplore}
          />
        )}

        {/* Fixed Bottom Navigation Bar */}
        <Navbar
          activeTab={activeNavTab}
          onTabChange={(tab) => {
            if (tab === 'profile') {
              // When tapping profile tab, reset to self
              setViewedUser(null);
            }
            setActiveNavTab(tab);
          }}
          onOpenPublish={() => setShowPublishModal(true)}
        />

        {/* MODAL: STORY VIEWER */}
        {activeStory && (
          <StoryViewer
            initialStory={activeStory}
            onClose={() => setActiveStory(null)}
          />
        )}

        {/* MODAL: COMMENTS SHEET */}
        <CommentsSheet
          post={commentPost}
          onClose={() => setCommentPost(null)}
          onSelectUser={handleSelectUser}
        />

        {/* MODAL: SHARE SHEET */}
        <ShareSheet
          post={sharePost}
          onClose={() => setSharePost(null)}
          onOpenReport={(post) => setReportPost(post)}
        />

        {/* MODAL: REPORT */}
        <ReportModal
          post={reportPost}
          onClose={() => setReportPost(null)}
        />

        {/* MODAL: PUBLISH (PERMANENT / 24H / STORY) */}
        {showPublishModal && (
          <PublishModal onClose={() => setShowPublishModal(false)} />
        )}

        {/* MODAL: EDIT PROFILE */}
        {showEditProfile && (
          <EditProfileModal onClose={() => setShowEditProfile(false)} />
        )}

        {/* MODAL: SETTINGS & PRIVACY */}
        {showSettings && (
          <SettingsView
            onClose={() => setShowSettings(false)}
            onOpenAdmin={() => {
              setShowSettings(false);
              setShowAdminDashboard(true);
            }}
          />
        )}

        {/* MODAL: ADMIN DASHBOARD */}
        {showAdminDashboard && (
          <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
        )}

        {/* MODAL: DIRECT MESSAGES */}
        {showMessages && (
          <MessagesView
            initialRecipient={directMessageUser}
            onClose={() => setShowMessages(false)}
            onSelectUser={handleSelectUser}
          />
        )}

        {/* MODAL: HASHTAG VIEW */}
        {selectedHashtag && (
          <HashtagModal
            tag={selectedHashtag}
            onClose={() => setSelectedHashtag(null)}
            onSelectPost={handleSelectPostFromExplore}
          />
        )}

        {/* MODAL: AUTH */}
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SocialProvider>
      <MainAppContent />
    </SocialProvider>
  );
}
