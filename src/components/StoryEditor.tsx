import React, { useState } from 'react';
import { X, Type, Smile, Sparkles, Volume2, VolumeX, Check, Image as ImageIcon } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

interface StoryEditorProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SAMPLE_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80'
];

const STICKERS = ['🔥', '⚡️', '💜', '✨', '🚀', '🏖️', '🍕', '🎧', '🛹', '📸'];
const FILTERS = [
  { name: 'Normal', filterClass: '' },
  { name: 'Neon', filterClass: 'contrast-125 saturate-150 hue-rotate-15' },
  { name: 'Cyber', filterClass: 'invert-[0.1] contrast-150 saturate-200' },
  { name: 'P&B', filterClass: 'grayscale contrast-125' },
  { name: 'Sunset', filterClass: 'sepia-[0.4] saturate-150' }
];

export const StoryEditor: React.FC<StoryEditorProps> = ({ onClose, onSuccess }) => {
  const { createStory } = useSocial();
  const [selectedBg, setSelectedBg] = useState(SAMPLE_BACKGROUNDS[0]);
  const [textOverlay, setTextOverlay] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<string>('✨');
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [customFileUrl, setCustomFileUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomFileUrl(url);
    }
  };

  const handlePublish = () => {
    createStory({
      mediaUrl: customFileUrl || selectedBg,
      mediaType: 'image',
      textOverlay: textOverlay.trim() || undefined,
      sticker: selectedSticker || undefined
    });
    onSuccess();
  };

  const mediaSource = customFileUrl || selectedBg;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none animate-fade-in">
      <div className="relative w-full h-full max-w-md bg-zinc-950 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Top Controls */}
        <div className="absolute top-4 left-3 right-3 z-30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStickerPicker(!showStickerPicker)}
              className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:text-purple-400"
              title="Adicionar Sticker"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:text-purple-400"
              title="Ajuste de Som"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Upload media */}
            <label className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:text-purple-400 cursor-pointer">
              <ImageIcon className="w-5 h-5" />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Story Canvas */}
        <div className="relative flex-1 w-full flex items-center justify-center bg-black overflow-hidden">
          <img
            src={mediaSource}
            alt="Story canvas"
            className={`w-full h-full object-cover transition-all ${selectedFilter.filterClass}`}
          />

          {/* Text Overlay centered */}
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
            <input
              type="text"
              value={textOverlay}
              onChange={(e) => setTextOverlay(e.target.value)}
              placeholder="Toque para adicionar texto..."
              className="w-full text-center text-lg font-extrabold text-white placeholder-white/70 bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-500/40 focus:outline-none shadow-2xl"
            />

            {selectedSticker && (
              <span className="text-5xl mt-4 animate-bounce drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                {selectedSticker}
              </span>
            )}
          </div>

          {/* Sticker Tray Overlay */}
          {showStickerPicker && (
            <div className="absolute bottom-24 inset-x-4 z-30 p-3 bg-zinc-950/90 backdrop-blur-md rounded-2xl border border-purple-900/50 shadow-2xl flex items-center justify-around flex-wrap gap-2">
              {STICKERS.map((stk) => (
                <button
                  key={stk}
                  onClick={() => {
                    setSelectedSticker(stk);
                    setShowStickerPicker(false);
                  }}
                  className="text-2xl hover:scale-125 transition-transform p-1"
                >
                  {stk}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Filter & Template Tray */}
        <div className="p-3 bg-zinc-950/95 border-t border-zinc-900 flex flex-col gap-3">
          {/* Preset Background choices */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider pl-1">
              Fundo:
            </span>
            {SAMPLE_BACKGROUNDS.map((bg, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCustomFileUrl(null);
                  setSelectedBg(bg);
                }}
                className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all ${
                  selectedBg === bg && !customFileUrl
                    ? 'border-purple-500 scale-105'
                    : 'border-transparent opacity-70'
                }`}
              >
                <img src={bg} alt="sample" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Filter Choices */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.name}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedFilter.name === f.name
                    ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Publish Story Button */}
          <button
            onClick={handlePublish}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Publicar Story (Disponível por 24 horas)
          </button>
        </div>
      </div>
    </div>
  );
};
