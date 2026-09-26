export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  birthDate?: string;
  isPrivate: boolean;
  role?: 'user' | 'admin';
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
  createdAt: string;
  blockedUserIds?: string[];
  isBanned?: boolean;
  password?: string;
}

export type ReportReason =
  | 'spam'
  | 'inappropriate'
  | 'harassment'
  | 'misinformation'
  | 'copyright'
  | 'other';

export type PostType = 'video' | 'photo' | 'text';
export type PostCategory = 'permanent' | '24h';

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: PostType;
  category: PostCategory; // 'permanent' or '24h'
  caption: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  duration?: number; // up to 60 seconds
  visibility: 'public' | 'private' | 'followers';
  createdAt: string; // ISO string
  expiresAt?: string; // for 24h posts
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  hashtags: string[];
  audioTitle?: string;
  location?: string;
  taggedUsers?: string[];
  status: 'active' | 'expired' | 'removed';
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'text';
  textOverlay?: string;
  textColor?: string;
  sticker?: string;
  createdAt: string;
  expiresAt: string;
  viewsCount: number;
  viewedByCurrentUser?: boolean;
  status: 'active' | 'expired' | 'removed';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  mediaUrl?: string;
  sharedPostId?: string;
  storyReplyId?: string;
  createdAt: string;
  readAt?: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'story' | 'message';

export interface Notification {
  id: string;
  userId: string;
  actorId: string;
  actor: User;
  type: NotificationType;
  referenceId?: string;
  referenceText?: string;
  readAt?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'post' | 'story' | 'comment' | 'user';
  targetId: string;
  postId?: string;
  reason: 'Spam' | 'Conteúdo inadequado' | 'Assédio' | 'Fraude' | 'Violência' | 'Direitos autorais' | 'Outro' | ReportReason | string;
  description?: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface FollowRequest {
  id: string;
  followerId: string;
  follower: User;
  followingId: string;
  createdAt: string;
}
