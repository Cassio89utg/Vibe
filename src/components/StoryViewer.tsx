import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Story } from '../types';
import { useSocial, sanitizeMediaUrl } from '../context/SocialContext';

interface StoryViewerProps {
  initialStory: Story;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ initialStory, onClose }) => {
  const { getActiveStories, sendMessage } = useSocial();
  const activeStories = getActiveStories();

  // Find all stories for the current creator
  const [currentUserIndex, setCurrentUserIndex] = useState(() => {
    // Unique user IDs list
    const userIds = Array.from(new Set(activeStories.map((s) => s.userId)));
    const idx = userIds.indexOf(initialStory.userId);
    return idx >= 0 ? idx : 0;
  });

  const uniqueUserIds = Array.from(new Set(activeStories.map((s) => s.userId)));
  const currentUserId = uniqueUserIds[currentUserIndex];
  const userStories = activeStories.filter((s) => s.userId === currentUserId);

  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [reactionSent, setReactionSent] = useState(false);

  const timerRef = useRef<any>(null);
  const STORY_DURATION = 5000; // 5 seconds per story
  const STEP = 50;

  const currentStory = userStories[storyIndex] || initialStory;

  // Handle progress timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (STEP / STORY_DURATION) * 100;
      });
    }, STEP);

    return () => clearInterval(timerRef.current);
  }, [isPaused, storyIndex, currentUserIndex]);

  const handleNext = () => {
    setProgress(0);
    if (storyIndex < userStories.length - 1) {
      setStoryIndex((prev) => prev + 1);
    } else if (currentUserIndex < uniqueUserIds.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setStoryIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex((prev) => prev - 1);
      setStoryIndex(0);
    }
  };

  const handleQuickReaction = () => {
    sendMessage(
      currentStory.userId,
      `Reagiu com ❤️ ao seu Story!`
    );
    setReactionSent(true);
    setTimeout(() => setReactionSent(false), 2000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendMessage(
      currentStory.userId,
      `Em resposta ao seu Story: "${replyText.trim()}"`
    );
    setReplyText('');
    setReactionSent(true);
    setTimeout(() => setReactionSent(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none">
      {/* Max mobile container */}
      <div className="relative w-full h-full max-w-md bg-zinc-950 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Progress Bars at top */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {userStories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    i < storyIndex
                      ? '100%'
                      : i === storyIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top bar with User Info & Close */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-pink-500">
              <img
                src={currentStory.user.avatarUrl}
                alt={currentStory.user.name}
                className="w-full h-full rounded-full object-cover border border-black"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                {currentStory.user.username}
                <Sparkles className="w-3 h-3 text-purple-400" />
              </p>
              <p className="text-[10px] text-zinc-300">
                24h Story
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Media Content */}
        <div
          className="relative flex-1 w-full h-full flex items-center justify-center bg-black"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {currentStory.mediaType === 'video' ? (
            <video
              src={sanitizeMediaUrl(currentStory.mediaUrl)}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallbackApplied) {
                  target.dataset.fallbackApplied = 'true';
                  target.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4';
                  target.load();
                  target.play().catch(() => {});
                }
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
            />
          )}

          {/* Text Overlay & Sticker */}
          {currentStory.textOverlay && (
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center pointer-events-none">
              <span className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md text-white font-bold text-base shadow-xl border border-purple-500/30">
                {currentStory.textOverlay}
              </span>
              {currentStory.sticker && (
                <span className="text-4xl mt-3 animate-bounce">
                  {currentStory.sticker}
                </span>
              )}
            </div>
          )}

          {/* Left/Right Tap zones for navigation */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/3 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-2/3 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          />
        </div>

        {/* Reaction Feedback banner */}
        {reactionSent && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold shadow-lg animate-bounce">
            Mensagem enviada com sucesso! ✨
          </div>
        )}

        {/* Bottom Reply Bar */}
        <div className="absolute bottom-4 left-3 right-3 z-30 flex items-center gap-2">
          <form onSubmit={handleSendReply} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Enviar mensagem para @${currentStory.user.username}...`}
              className="w-full bg-black/60 backdrop-blur-md text-xs text-white placeholder-zinc-400 px-4 py-3 rounded-full border border-white/20 focus:outline-none focus:border-purple-400"
            />
            {replyText.trim() && (
              <button
                type="submit"
                className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-500 shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            onClick={handleQuickReaction}
            className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-pink-400 border border-white/20 active:scale-90 transition-all"
            title="Reagir com coração"
          >
            <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
