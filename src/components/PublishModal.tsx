import React, { useState } from 'react';
import {
  X,
  FileText,
  Clock,
  CircleDot,
  Upload,
  Video,
  Image as ImageIcon,
  MapPin,
  Hash,
  Lock,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { StoryEditor } from './StoryEditor';

interface PublishModalProps {
  onClose: () => void;
}

type PublishStep = 'choose_type' | 'create_post' | 'story_editor';

const SAMPLE_VIDEOS = [
  {
    name: 'Skate Urbano',
    url: 'https://media.w3.org/2010/05/video/movie_300.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&auto=format&fit=crop&q=80',
    duration: 24
  },
  {
    name: 'Flores & Natureza',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80',
    duration: 32
  },
  {
    name: 'Animação 3D Vibe',
    url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    duration: 18
  },
  {
    name: 'Noite Neon & Festa',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    duration: 45
  }
];

export const PublishModal: React.FC<PublishModalProps> = ({ onClose }) => {
  const { createPost } = useSocial();

  const [step, setStep] = useState<PublishStep>('choose_type');
  const [chosenCategory, setChosenCategory] = useState<'permanent' | '24h'>('permanent');

  // Form State
  const [selectedMedia, setSelectedMedia] = useState(SAMPLE_VIDEOS[0]);
  const [customFileUrl, setCustomFileUrl] = useState<string | null>(null);
  const [customFileType, setCustomFileType] = useState<'video' | 'photo'>('video');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['vibe']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [location, setLocation] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'followers'>('public');
  const [audioTitle, setAudioTitle] = useState('Som original - VIBE');
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [durationError, setDurationError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video');
      const url = URL.createObjectURL(file);
      setCustomFileUrl(url);
      setCustomFileType(isVideo ? 'video' : 'photo');

      // Video duration check (max 60s)
      if (isVideo) {
        const videoElement = document.createElement('video');
        videoElement.src = url;
        videoElement.onloadedmetadata = () => {
          if (videoElement.duration > 60) {
            setDurationError('O vídeo deve ter até 60 segundos. Foi detectado ' + Math.round(videoElement.duration) + 's.');
          } else {
            setDurationError('');
          }
        };
        videoElement.onerror = () => {
          setDurationError('Formato de vídeo não suportado pelo navegador.');
        };
      } else {
        setDurationError('');
      }
    }
  };

  const handleAddHashtag = (tagToAdd: string) => {
    const clean = tagToAdd.replace('#', '').trim().toLowerCase();
    if (clean && !hashtags.includes(clean)) {
      setHashtags([...hashtags, clean]);
    }
    setCustomTagInput('');
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (durationError) return;

    createPost({
      type: customFileType,
      category: chosenCategory,
      caption: caption.trim() || 'Sem legenda',
      mediaUrl: customFileUrl || selectedMedia.url,
      thumbnailUrl: customFileUrl ? undefined : selectedMedia.thumbnail,
      duration: customFileType === 'video' ? selectedMedia.duration : undefined,
      hashtags,
      audioTitle,
      location: location.trim() || undefined
    });

    setPublishedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (step === 'story_editor') {
    return (
      <StoryEditor
        onClose={onClose}
        onSuccess={() => {
          setPublishedSuccess(true);
          setTimeout(() => onClose(), 1200);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 select-none animate-fade-in">
      {/* Modal Card */}
      <div
        id="publish-modal"
        className="relative w-full max-w-md bg-zinc-950 border border-purple-900/50 rounded-3xl p-5 shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success State Overlay */}
        {publishedSuccess && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-purple-400 animate-bounce mb-3" />
            <h3 className="text-lg font-bold text-white">
              {chosenCategory === '24h'
                ? 'Publicado por 24 horas!'
                : 'Publicado com sucesso!'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {chosenCategory === '24h'
                ? 'Seu conteúdo estará no feed durante as próximas 24h.'
                : 'Seu conteúdo está disponível no seu perfil e no feed.'}
            </p>
          </div>
        )}

        {!publishedSuccess && step === 'choose_type' && (
          <div className="flex flex-col gap-4">
            <div className="text-center pt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Nova Publicação
              </span>
              <h2 className="text-xl font-extrabold text-white mt-0.5">
                Como você quer publicar?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Escolha o formato e a duração ideal para seu momento
              </p>
            </div>

            {/* OPÇÃO 1 — PERMANENTE */}
            <button
              onClick={() => {
                setChosenCategory('permanent');
                setStep('create_post');
              }}
              className="group flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/60 hover:bg-purple-950/20 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300">
                  Permanente
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Fica no seu perfil até você decidir excluir. Ideal para seus melhores vídeos e momentos memoráveis.
                </p>
              </div>
            </button>

            {/* OPÇÃO 2 — DESAPARECE EM 24H (VIBE Signature) */}
            <button
              onClick={() => {
                setChosenCategory('24h');
                setStep('create_post');
              }}
              className="group relative flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-pink-950/30 border border-purple-500/50 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300">
                    Desaparece em 24h
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/40 text-[9px] font-bold text-purple-200 uppercase">
                    Exclusivo VIBE
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                  Seu conteúdo ficará disponível por 24 horas no feed e perfil, e depois será removido automaticamente da experiência pública.
                </p>
              </div>
            </button>

            {/* OPÇÃO 3 — STORY */}
            <button
              onClick={() => setStep('story_editor')}
              className="group flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/60 hover:bg-purple-950/20 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-900/40 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <CircleDot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-pink-300">
                  Story
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Compartilhe um momento rápido em tela cheia com figurinhas, filtros e textos que fica disponível por 24 horas na barra superior.
                </p>
              </div>
            </button>
          </div>
        )}

        {/* STEP 2: CREATE POST (PERMANENT OR 24H) */}
        {!publishedSuccess && step === 'create_post' && (
          <form onSubmit={handleSubmitPost} className="flex flex-col gap-4">
            {/* Header with back navigation */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
              <button
                type="button"
                onClick={() => setStep('choose_type')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                ← Voltar
              </button>
              <h3 className="text-sm font-bold text-white">
                {chosenCategory === '24h' ? 'Publicação 24H' : 'Publicação Permanente'}
              </h3>
              <div className="w-8" />
            </div>

            {/* 24H Notice Banner */}
            {chosenCategory === '24h' && (
              <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-purple-400 animate-pulse flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-purple-200">
                    PUBLICAÇÃO TEMPORÁRIA (24H)
                  </h4>
                  <p className="text-[11px] text-zinc-300 mt-0.5">
                    Este conteúdo será exibido no feed e no perfil durante 24 horas. Contador ativo: <span className="font-bold text-purple-300">Expira em 23h 59min</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Media Selector & Upload */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Vídeo ou Foto (até 60 segundos)</span>
                <span className="text-[10px] text-purple-400">Vertical 9:16</span>
              </label>

              {/* Upload own file option */}
              <div className="flex items-center gap-2 mb-2">
                <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-dashed border-purple-500/50 cursor-pointer text-xs text-purple-300 hover:text-white transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Enviar arquivo do dispositivo</span>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {durationError && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 p-2 rounded-xl bg-red-950/50 border border-red-800/50 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  {durationError}
                </div>
              )}

              {/* Preset vertical videos */}
              <span className="text-[11px] text-zinc-400 block mb-1">
                Ou selecione um vídeo demonstrativo em alta resolução:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_VIDEOS.map((vid) => (
                  <div
                    key={vid.name}
                    onClick={() => {
                      setCustomFileUrl(null);
                      setCustomFileType('video');
                      setSelectedMedia(vid);
                    }}
                    className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedMedia.name === vid.name && !customFileUrl
                        ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)] scale-105'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={vid.thumbnail}
                      alt={vid.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/70 text-[9px] text-white">
                      {vid.duration}s
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption Input */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                Legenda
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Escreva algo sobre este momento na VIBE..."
                className="w-full bg-zinc-900 text-xs text-white placeholder-zinc-500 p-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-purple-500/70"
              />
            </div>

            {/* Hashtags */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 flex items-center justify-between">
                <span>Hashtags</span>
                <span className="text-[10px] text-zinc-500">Pressione Enter ou vírgula</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-800/60 text-xs text-purple-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(tag)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddHashtag(customTagInput);
                    }
                  }}
                  placeholder="Ex: viagem, natureza, vibe24h"
                  className="flex-1 bg-zinc-900 text-xs text-white placeholder-zinc-500 px-3 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-purple-500/70"
                />
                <button
                  type="button"
                  onClick={() => handleAddHashtag(customTagInput)}
                  className="px-3 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-200 hover:text-white hover:bg-zinc-700"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {/* Location & Audio */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Localização
                </label>
                <div className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-2 rounded-xl border border-zinc-800">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Rio de Janeiro"
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Privacidade
                </label>
                <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setPrivacy('public')}
                    className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium transition-all ${
                      privacy === 'public'
                        ? 'bg-purple-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    Público
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrivacy('followers')}
                    className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium transition-all ${
                      privacy === 'followers'
                        ? 'bg-purple-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    Seguidores
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!!durationError}
              className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {chosenCategory === '24h'
                ? 'Publicar Agora (Desaparece em 24h)'
                : 'Publicar Agora (Permanente)'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
