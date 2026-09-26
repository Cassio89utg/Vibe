import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, Story, Comment, Message, Conversation, Notification, Report } from '../types';
import {
  CURRENT_DEMO_USER,
  MOCK_USERS,
  MOCK_STORIES,
  MOCK_POSTS,
  MOCK_COMMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES_MAP,
  MOCK_REPORTS
} from '../data/mockData';

interface SocialContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  stories: Story[];
  conversations: Conversation[];
  notifications: Notification[];
  reports: Report[];
  activeFeedTab: 'for_you' | 'following' | '24h';
  setActiveFeedTab: (tab: 'for_you' | 'following' | '24h') => void;
  // Actions
  login: (emailOrUser: string, password?: string) => boolean;
  signup: (userData: Partial<User> & { password?: string }) => boolean;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  // Post & Story publishing
  createPost: (postData: {
    type: 'video' | 'photo' | 'text';
    category: 'permanent' | '24h';
    caption: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    duration?: number;
    hashtags: string[];
    audioTitle?: string;
    location?: string;
  }) => Post;
  createStory: (storyData: {
    mediaUrl: string;
    mediaType: 'image' | 'video' | 'text';
    textOverlay?: string;
    textColor?: string;
    sticker?: string;
  }) => Story;
  // Interactions
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  incrementViews: (postId: string) => void;
  toggleFollowUser: (targetUserId: string) => void;
  isFollowingUser: (userId: string) => boolean;
  blockUser: (targetUserId: string) => void;
  unblockUser: (targetUserId: string) => void;
  isUserBlocked: (userId: string) => boolean;
  // Comments
  getCommentsForPost: (postId: string) => Comment[];
  addComment: (postId: string, text: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  // Messaging
  getMessages: (conversationId: string) => Message[];
  sendMessage: (receiverId: string, text: string, mediaUrl?: string) => void;
  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  // Reporting & Moderation (Admin)
  reportPost: (postId: string, reason: any, description?: string) => void;
  submitReport: (targetType: 'post' | 'story' | 'comment' | 'user', targetId: string, reason: any, description?: string) => void;
  deletePost: (postId: string) => void;
  adminDeletePost: (postId: string) => void;
  adminDismissReport: (reportId: string) => void;
  adminResolveReport: (reportId: string, actionType: 'delete_post' | 'suspend_user') => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'delete_content') => void;
  cleanExpiredContent: () => number;
  updateUserBan: (userId: string, isBanned: boolean) => void;
  toggleUserVerification: (userId: string) => void;
  // Helpers
  getActivePosts: () => Post[];
  getActiveStories: () => Story[];
  formatRemainingTime: (expiresAt?: string) => string;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'vibe_current_user',
  POSTS: 'vibe_posts_data',
  STORIES: 'vibe_stories_data',
  NOTIFS: 'vibe_notifs_data',
  USERS: 'vibe_users_data',
  CONVS: 'vibe_conversations_data',
  MSGS: 'vibe_messages_data',
  COMMENTS: 'vibe_comments_data',
  REPORTS: 'vibe_reports_data',
  FOLLOWS: 'vibe_following_set'
};

const RELIABLE_VIDEO_URLS = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://media.w3.org/2010/05/video/movie_300.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://cdn.jsdelivr.net/gh/web-platform-tests/wpt@master/media/movie_5.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4'
];

export const sanitizeMediaUrl = (url?: string, fallbackIndex = 0): string => {
  if (!url || typeof url !== 'string' || url.includes('mixkit.co') || url.includes('commondatastorage.googleapis.com')) {
    return RELIABLE_VIDEO_URLS[fallbackIndex % RELIABLE_VIDEO_URLS.length];
  }
  return url;
};

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return CURRENT_DEMO_USER;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (saved) {
      try {
        const parsed: Post[] = JSON.parse(saved);
        return parsed.map((p, idx) => ({
          ...p,
          mediaUrl: p.type === 'video' ? sanitizeMediaUrl(p.mediaUrl, idx) : p.mediaUrl
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
    if (saved) {
      try {
        const parsed: Story[] = JSON.parse(saved);
        return parsed.map((s, idx) => ({
          ...s,
          mediaUrl: s.mediaType === 'video' ? sanitizeMediaUrl(s.mediaUrl, idx) : s.mediaUrl
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_STORIES;
  });

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    return saved ? JSON.parse(saved) : MOCK_COMMENTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVS);
    return saved ? JSON.parse(saved) : MOCK_CONVERSATIONS;
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MSGS);
    return saved ? JSON.parse(saved) : MOCK_MESSAGES_MAP;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : MOCK_REPORTS;
  });

  // Track user's following list as a Set of user IDs
  const [followingSet, setFollowingSet] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWS);
    return saved ? JSON.parse(saved) : ['u_1', 'u_2'];
  });

  const [activeFeedTab, setActiveFeedTab] = useState<'for_you' | 'following' | '24h'>('for_you');

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(commentsMap));
  }, [commentsMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MSGS, JSON.stringify(messagesMap));
  }, [messagesMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(followingSet));
  }, [followingSet]);

  // Auth Methods
  const login = (emailOrUser: string, _password?: string) => {
    const term = emailOrUser.toLowerCase().replace('@', '').trim();
    const found =
      users.find(
        (u) =>
          u.email.toLowerCase() === term ||
          u.username.toLowerCase() === term
      ) || CURRENT_DEMO_USER;
    setCurrentUser(found);
    return true;
  };

  const signup = (userData: Partial<User> & { password?: string }) => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: userData.name || 'Novo Usuário',
      username: userData.username?.replace('@', '').trim().toLowerCase() || `viber_${Date.now().toString().slice(-4)}`,
      email: userData.email || '',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      bio: userData.bio || 'Criando minha vibe na nova rede social ✨',
      birthDate: userData.birthDate,
      password: userData.password,
      isPrivate: false,
      role: 'user',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
      blockedUserIds: []
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    // Also update author info in user's posts
    setPosts((prev) =>
      prev.map((p) => (p.userId === currentUser.id ? { ...p, user: updated } : p))
    );
  };

  // Automated 24h expiration check
  const getActivePosts = () => {
    const now = Date.now();
    return posts.filter((p) => {
      if (p.status === 'removed') return false;
      if (p.category === '24h' && p.expiresAt) {
        return new Date(p.expiresAt).getTime() > now;
      }
      return true;
    });
  };

  const getActiveStories = () => {
    const now = Date.now();
    return stories.filter((s) => {
      if (s.status === 'removed') return false;
      return new Date(s.expiresAt).getTime() > now;
    });
  };

  const formatRemainingTime = (expiresAt?: string) => {
    if (!expiresAt) return '';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expirado';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `Expira em ${hours}h ${minutes}m`;
    }
    return `Expira em ${minutes}m`;
  };

  // Publish Post
  const createPost = (postData: {
    type: 'video' | 'photo' | 'text';
    category: 'permanent' | '24h';
    caption: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    duration?: number;
    hashtags: string[];
    audioTitle?: string;
    location?: string;
  }): Post => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    const now = new Date();
    let expiresAt: string | undefined = undefined;
    if (postData.category === '24h') {
      const expDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      expiresAt = expDate.toISOString();
    }

    const newPost: Post = {
      id: `p_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      type: postData.type,
      category: postData.category,
      caption: postData.caption,
      mediaUrl: postData.mediaUrl,
      thumbnailUrl: postData.thumbnailUrl || postData.mediaUrl,
      duration: postData.duration || (postData.type === 'video' ? 30 : undefined),
      visibility: 'public',
      createdAt: now.toISOString(),
      expiresAt,
      viewsCount: 1,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      hashtags: postData.hashtags,
      audioTitle: postData.audioTitle || 'Som original - ' + currentUser.name,
      location: postData.location,
      status: 'active',
      isLiked: false,
      isSaved: false
    };

    setPosts((prev) => [newPost, ...prev]);

    // Update user post count
    updateProfile({ postsCount: (currentUser.postsCount || 0) + 1 });

    return newPost;
  };

  // Publish Story
  const createStory = (storyData: {
    mediaUrl: string;
    mediaType: 'image' | 'video' | 'text';
    textOverlay?: string;
    textColor?: string;
    sticker?: string;
  }): Story => {
    if (!currentUser) throw new Error('Usuário não autenticado');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const newStory: Story = {
      id: `st_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      mediaUrl: storyData.mediaUrl,
      mediaType: storyData.mediaType,
      textOverlay: storyData.textOverlay,
      textColor: storyData.textColor,
      sticker: storyData.sticker,
      createdAt: now.toISOString(),
      expiresAt,
      viewsCount: 0,
      viewedByCurrentUser: true,
      status: 'active'
    };

    setStories((prev) => [newStory, ...prev]);
    return newStory;
  };

  // Likes
  const toggleLikePost = (postId: string) => {
    if (!currentUser) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const willLike = !p.isLiked;

        // If liking and author is not self, generate notification
        if (willLike && p.userId !== currentUser.id) {
          const newNotif: Notification = {
            id: `notif_${Date.now()}`,
            userId: p.userId,
            actorId: currentUser.id,
            actor: currentUser,
            type: 'like',
            referenceId: p.id,
            referenceText: 'curtiu seu vídeo',
            createdAt: 'agora'
          };
          setNotifications((nPrev) => [newNotif, ...nPrev]);
        }

        return {
          ...p,
          isLiked: willLike,
          likesCount: willLike ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      })
    );
  };

  // Saves
  const toggleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const willSave = !p.isSaved;
        return {
          ...p,
          isSaved: willSave,
          savesCount: willSave ? p.savesCount + 1 : Math.max(0, p.savesCount - 1)
        };
      })
    );
  };

  const incrementViews = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, viewsCount: p.viewsCount + 1 } : p))
    );
  };

  // Follows
  const toggleFollowUser = (targetUserId: string) => {
    if (!currentUser || targetUserId === currentUser.id) return;
    const isCurrentlyFollowing = followingSet.includes(targetUserId);

    if (isCurrentlyFollowing) {
      setFollowingSet((prev) => prev.filter((id) => id !== targetUserId));
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUserId ? { ...u, followersCount: Math.max(0, u.followersCount - 1) } : u
        )
      );
      updateProfile({ followingCount: Math.max(0, (currentUser.followingCount || 0) - 1) });
    } else {
      setFollowingSet((prev) => [...prev, targetUserId]);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, followersCount: u.followersCount + 1 } : u))
      );
      updateProfile({ followingCount: (currentUser.followingCount || 0) + 1 });

      // Create notification
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: targetUserId,
        actorId: currentUser.id,
        actor: currentUser,
        type: 'follow',
        referenceText: 'começou a seguir você',
        createdAt: 'agora'
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const isFollowingUser = (userId: string) => followingSet.includes(userId);

  // Block/Unblock
  const blockUser = (targetUserId: string) => {
    if (!currentUser) return;
    const blockedList = currentUser.blockedUserIds || [];
    if (!blockedList.includes(targetUserId)) {
      updateProfile({ blockedUserIds: [...blockedList, targetUserId] });
    }
  };

  const unblockUser = (targetUserId: string) => {
    if (!currentUser) return;
    const blockedList = currentUser.blockedUserIds || [];
    updateProfile({ blockedUserIds: blockedList.filter((id) => id !== targetUserId) });
  };

  const isUserBlocked = (userId: string) => {
    return currentUser?.blockedUserIds?.includes(userId) || false;
  };

  // Comments
  const getCommentsForPost = (postId: string) => commentsMap[postId] || [];

  const addComment = (postId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const targetPost = posts.find((p) => p.id === postId);

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      postId,
      userId: currentUser.id,
      user: currentUser,
      text: text.trim(),
      createdAt: 'agora',
      likesCount: 0,
      isLiked: false
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])]
    }));

    // Increment post commentsCount
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    // Create notification if not self
    if (targetPost && targetPost.userId !== currentUser.id) {
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: targetPost.userId,
        actorId: currentUser.id,
        actor: currentUser,
        type: 'comment',
        referenceId: postId,
        referenceText: `comentou: "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}"`,
        createdAt: 'agora'
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const deleteComment = (postId: string, commentId: string) => {
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).filter((c) => c.id !== commentId)
    }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p
      )
    );
  };

  const toggleLikeComment = (postId: string, commentId: string) => {
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).map((c) => {
        if (c.id !== commentId) return c;
        const willLike = !c.isLiked;
        return {
          ...c,
          isLiked: willLike,
          likesCount: willLike ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
        };
      })
    }));
  };

  // Direct Messages
  const getMessages = (conversationId: string) => messagesMap[conversationId] || [];

  const sendMessage = (receiverId: string, text: string, mediaUrl?: string) => {
    if (!currentUser) return;
    const targetUser = users.find((u) => u.id === receiverId);
    if (!targetUser) return;

    // Find or create conversation
    let conv = conversations.find((c) => c.participant.id === receiverId);
    const convId = conv ? conv.id : `conv_${Date.now()}`;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      receiverId,
      text,
      mediaUrl,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };

    setMessagesMap((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg]
    }));

    if (conv) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, lastMessage: newMsg, updatedAt: new Date().toISOString() }
            : c
        )
      );
    } else {
      const newConv: Conversation = {
        id: convId,
        participant: targetUser,
        lastMessage: newMsg,
        unreadCount: 0,
        updatedAt: new Date().toISOString()
      };
      setConversations((prev) => [newConv, ...prev]);
    }
  };

  // Notifications
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
    );
  };

  // Moderation
  const submitReport = (
    targetType: 'post' | 'story' | 'comment' | 'user',
    targetId: string,
    reason: any,
    description?: string
  ) => {
    if (!currentUser) return;
    const newReport: Report = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      targetType,
      targetId,
      reason,
      description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const adminDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const adminDismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
    );
  };

  const adminResolveReport = (reportId: string, actionType: 'delete_post' | 'suspend_user') => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    if (actionType === 'delete_post' && report.targetType === 'post') {
      adminDeletePost(report.targetId);
    }
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
  };

  const reportPost = (postId: string, reason: any, description?: string) => {
    submitReport('post', postId, reason, description);
  };

  const deletePost = (postId: string) => {
    adminDeletePost(postId);
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'delete_content') => {
    if (action === 'dismiss') {
      adminDismissReport(reportId);
    } else {
      adminResolveReport(reportId, 'delete_post');
    }
  };

  const cleanExpiredContent = () => {
    const now = Date.now();
    let count = 0;
    setPosts((prev) =>
      prev.filter((p) => {
        if (p.category === '24h' && p.expiresAt) {
          if (new Date(p.expiresAt).getTime() <= now) {
            count++;
            return false;
          }
        }
        return true;
      })
    );
    setStories((prev) =>
      prev.filter((s) => {
        if (new Date(s.expiresAt).getTime() <= now) {
          count++;
          return false;
        }
        return true;
      })
    );
    return count;
  };

  const updateUserBan = (userId: string, isBanned: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned } : u))
    );
  };

  const toggleUserVerification = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerified: !u.isVerified } : u))
    );
  };

  return (
    <SocialContext.Provider
      value={{
        currentUser,
        users,
        posts,
        stories,
        conversations,
        notifications,
        reports,
        activeFeedTab,
        setActiveFeedTab,
        login,
        signup,
        logout,
        updateProfile,
        createPost,
        createStory,
        toggleLikePost,
        toggleSavePost,
        incrementViews,
        toggleFollowUser,
        isFollowingUser,
        blockUser,
        unblockUser,
        isUserBlocked,
        getCommentsForPost,
        addComment,
        deleteComment,
        toggleLikeComment,
        getMessages,
        sendMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        reportPost,
        submitReport,
        deletePost,
        adminDeletePost,
        adminDismissReport,
        adminResolveReport,
        resolveReport,
        cleanExpiredContent,
        updateUserBan,
        toggleUserVerification,
        getActivePosts,
        getActiveStories,
        formatRemainingTime
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
