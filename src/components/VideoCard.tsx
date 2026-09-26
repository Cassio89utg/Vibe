import React, { useRef, useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Clock,
  Music2,
  Check,
  UserPlus,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Post, User } from '../types';
import { useSocial, sanitizeMediaUrl } from '../context/SocialContext';

interface VideoCardProps {
  post: Post;
  isActive: boolean;
  onOpenComments?: (post: Post) => void;
  onCommentClick?: (post?: Post) => void;
  onOpenShare?: (post: Post) => void;
  onShareClick?: (post?: Post) => void;
  onSelectUser?: (user: User) => void;
  onUserClick?: (user?: User) => void;
  onSelectHashtag?: (tag: string) => void;
  onHashtagClick?: (tag: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  post,
  isActive,
  onOpenComments,
  onCommentClick,
  onOpenShare,
  onShareClick,
  onSelectUser,
  onUserClick,
  onSelectHashtag,
  onHashtagClick
}) => {
  const handleComments = () => {
    if (onOpenComments) onOpenComments(post);
    if (onCommentClick) onCommentClick(post);
  };
  const handleShare = () => {
    if (onOpenShare) onOpenShare(post);
    if (onShareClick) onShareClick(post);
  };
  const handleUser = () => {
    if (onSelectUser) onSelectUser(post.user);
    if (onUserClick) onUserClick(post.user);
  };
  const handleTag = (tag: string) => {
    if (onSelectHashtag) onSelectHashtag(tag);
    if (onHashtagClick) onHashtagClick(tag);
  };
  const {
    currentUser,
    toggleLikePost,
    toggleSavePost,
    toggleFollowUser,
    isFollowingUser,
    incrementViews,
    formatRemainingTime
  } = useSocial();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaSrc, setMediaSrc] = useState<string>(() => sanitizeMediaUrl(post.mediaUrl));
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState<boolean>(false);
  const lastTapRef = useRef<number>(0);

  const isFollowed = isFollowingUser(post.userId);
  const isSelf = currentUser?.id === post.userId;
  const is24h = post.category === '24h';
  const remainingTimeStr = is24h ? formatRemainingTime(post.expiresAt) : '';

  // Update mediaSrc when post changes
  useEffect(() => {
    setMediaSrc(sanitizeMediaUrl(post.mediaUrl));
    setHasError(false);
  }, [post.mediaUrl]);

  // Handle play/pause when active state changes (snap scroll)
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive && !hasError) {
      incrementViews(post.id);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log('Autoplay handled/blocked:', err);
            setIsPlaying(false);
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, post.id, hasError, mediaSrc]);

  // Handle time update for progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const togglePlay = () => {
    if (hasError) return;
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Double tap to like gesture
  const handleDoubleTap = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        toggleLikePost(post.id);
      }
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 900);
    } else {
      togglePlay();
    }
    lastTapRef.current = now;
  };

  const handleVideoError = () => {
    const SAFE_FALLBACK = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
    if (mediaSrc !== SAFE_FALLBACK) {
      // Automatically attempt to fall back to rock-solid CDN video
      setMediaSrc(SAFE_FALLBACK);
      if (videoRef.current) {
        videoRef.current.load();
        if (isActive) {
          videoRef.current.play().catch(() => {});
        }
      }
    } else {
      // If even fallback fails, switch to aesthetic poster view smoothly
      setHasError(true);
    }
  };

  const handleRetryVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setMediaSrc('https://media.w3.org/2010/05/video/movie_300.mp4');
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  };

  return (
    <div
      id={`post-${post.id}`}
      className="relative w-full h-[calc(100vh-125px)] max-h-[820px] bg-black flex items-center justify-center snap-start overflow-hidden rounded-2xl border border-zinc-900 shadow-2xl my-1"
    >
      {/* Video Content */}
      <div
        className="relative w-full h-full cursor-pointer flex items-center justify-center bg-zinc-950"
        onClick={handleDoubleTap}
      >
        {post.type === 'video' && !hasError ? (
          <video
            ref={videoRef}
            src={mediaSrc}
            poster={post.thumbnailUrl}
            playsInline
            loop
            muted={isMuted}
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onError={handleVideoError}
            className="w-full h-full object-cover select-none"
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={post.thumbnailUrl || post.mediaUrl}
              alt={post.caption}
              className={`w-full h-full object-cover select-none transition-transform duration-1000 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          </div>
        )}

        {/* Double Tap Floating Heart Animation */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping">
            <Heart className="w-24 h-24 text-pink-500 fill-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
          </div>
        )}

        {/* Play / Pause indicator icon */}
        {!isPlaying && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/25 z-10">
            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
              <Play className="w-8 h-8 fill-white ml-1 text-white" />
            </div>
          </div>
        )}

        {/* Sound Toggle Button (Top Right) */}
        <button
          onClick={toggleSound}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition-all"
          title={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
        </button>

        {/* Top 24h Expiration Badge */}
        {is24h && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <Clock className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wide text-purple-300">
              {remainingTimeStr || '⏳ 24 Horas'}
            </span>
          </div>
        )}
      </div>

      {/* Right Action Rail */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 select-none">
        {/* Creator Avatar with Follow Button */}
        <div className="relative mb-2">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleUser();
            }}
            className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-pink-500 cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={post.user.avatarUrl}
              alt={post.user.name}
              className="w-full h-full rounded-full object-cover border border-black"
            />
          </div>

          {!isSelf && !isFollowed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFollowUser(post.userId);
              }}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center border border-black shadow-[0_0_8px_rgba(236,72,153,0.8)] active:scale-90 transition-transform"
              title="Seguir criador"
            >
              <UserPlus className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLikePost(post.id);
          }}
          className="group flex flex-col items-center gap-1"
          title="Curtir"
        >
          <div
            className={`p-2.5 rounded-full backdrop-blur-md transition-all active:scale-75 ${
              post.isLiked
                ? 'bg-pink-500/25 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)]'
                : 'bg-black/50 text-white hover:bg-black/70 hover:text-pink-400'
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                post.isLiked ? 'fill-pink-500' : ''
              }`}
            />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow-md">
            {post.likesCount > 999 ? `${(post.likesCount / 1000).toFixed(1)}k` : post.likesCount}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleComments();
          }}
          className="group flex flex-col items-center gap-1"
          title="Comentários"
        >
          <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 hover:text-purple-400 transition-all active:scale-75">
            <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow-md">
            {post.commentsCount > 999
              ? `${(post.commentsCount / 1000).toFixed(1)}k`
              : post.commentsCount}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="group flex flex-col items-center gap-1"
          title="Compartilhar"
        >
          <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 hover:text-purple-400 transition-all active:scale-75">
            <Share2 className="w-6 h-6 transition-transform group-hover:scale-110" />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow-md">
            {post.sharesCount}
          </span>
        </button>

        {/* Save / Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSavePost(post.id);
          }}
          className="group flex flex-col items-center gap-1"
          title="Salvar"
        >
          <div
            className={`p-2.5 rounded-full backdrop-blur-md transition-all active:scale-75 ${
              post.isSaved
                ? 'bg-purple-500/25 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]'
                : 'bg-black/50 text-white hover:bg-black/70 hover:text-purple-400'
            }`}
          >
            <Bookmark
              className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                post.isSaved ? 'fill-purple-400' : ''
              }`}
            />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow-md">
            {post.savesCount}
          </span>
        </button>

        {/* Spinning Music Disc */}
        <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-purple-500/60 flex items-center justify-center overflow-hidden animate-spin [animation-duration:6s] shadow-lg">
          <Music2 className="w-4 h-4 text-purple-300" />
        </div>
      </div>

      {/* Bottom Overlay: Author, Caption, Hashtags, Audio */}
      <div className="absolute left-0 bottom-0 right-16 p-4 pb-5 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto">
        {/* Creator Username & Follow indicator */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span
            onClick={() => handleUser()}
            className="text-sm font-bold text-white cursor-pointer hover:text-purple-300 drop-shadow-md flex items-center gap-1"
          >
            @{post.user.username}
            {post.user.isVerified && (
              <span className="w-3.5 h-3.5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            )}
          </span>

          {!isSelf && (
            <button
              onClick={() => toggleFollowUser(post.userId)}
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-all ${
                isFollowed
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  : 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]'
              }`}
            >
              {isFollowed ? 'Seguindo' : 'Seguir'}
            </button>
          )}

          {is24h && (
            <span className="px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-[10px] font-semibold text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              24H Vibe
            </span>
          )}
        </div>

        {/* Caption */}
        <p className="text-xs text-zinc-100 line-clamp-2 leading-relaxed drop-shadow mb-2 font-normal">
          {post.caption}
        </p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.hashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTag(tag)}
                className="text-[11px] font-semibold text-purple-300 hover:text-pink-300 drop-shadow"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Audio Utilized */}
        <div className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
          <Music2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span className="truncate max-w-[200px]">
            {post.audioTitle || 'Som original - VIBE'}
          </span>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      {post.type === 'video' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
