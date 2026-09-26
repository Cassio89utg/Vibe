import React, { useState } from 'react';
import { X, Flag, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Post, ReportReason } from '../types';
import { useSocial } from '../context/SocialContext';

interface ReportModalProps {
  post: Post | null;
  onClose: () => void;
}

const REASONS: { label: string; value: ReportReason }[] = [
  { label: 'Spam ou golpe', value: 'spam' },
  { label: 'Conteúdo impróprio ou sexual', value: 'inappropriate' },
  { label: 'Assédio ou discurso de ódio', value: 'harassment' },
  { label: 'Desinformação ou fake news', value: 'misinformation' },
  { label: 'Violação de direitos autorais', value: 'copyright' },
  { label: 'Outro motivo', value: 'other' }
];

export const ReportModal: React.FC<ReportModalProps> = ({ post, onClose }) => {
  const { reportPost } = useSocial();
  const [selectedReason, setSelectedReason] = useState<ReportReason>('inappropriate');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportPost(post.id, selectedReason, details.trim() || undefined);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-red-900/40 rounded-3xl p-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center text-center py-8">
            <CheckCircle2 className="w-14 h-14 text-purple-400 animate-bounce mb-3" />
            <h3 className="text-base font-bold text-white">Denúncia Enviada</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-[260px]">
              Obrigado por colaborar. Nossa equipe de moderação e o Painel Administrativo da VIBE já receberam sua denúncia para análise.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Denunciar Publicação</h3>
                <p className="text-[11px] text-zinc-400">
                  Publicação de @{post.user.username}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 block">
                Por que você está denunciando este conteúdo?
              </label>
              <div className="space-y-1.5">
                {REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedReason === r.value
                        ? 'bg-red-950/30 border-red-500/60 text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-xs font-medium">{r.label}</span>
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={selectedReason === r.value}
                      onChange={() => setSelectedReason(r.value)}
                      className="accent-red-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Detalhes adicionais (opcional)
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explique o que aconteceu..."
                className="w-full bg-zinc-900 text-xs text-white placeholder-zinc-500 p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-500/70"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              Enviar Denúncia
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
