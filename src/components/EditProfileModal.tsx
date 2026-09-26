import React, { useState } from 'react';
import { X, Camera, Check, AlertCircle } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

interface EditProfileModalProps {
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { currentUser, updateProfile, users } = useSocial();

  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || PRESET_AVATARS[0]);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase().replace('@', '');

    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    if (!cleanUsername) {
      setError('O nome de usuário é obrigatório.');
      return;
    }

    // Check unique username
    const usernameTaken = users.some(
      (u) => u.id !== currentUser?.id && u.username.toLowerCase() === cleanUsername
    );

    if (usernameTaken) {
      setError('Este nome de usuário já está em uso na VIBE.');
      return;
    }

    updateProfile({
      name: name.trim(),
      username: cleanUsername,
      bio: bio.trim(),
      avatarUrl
    });

    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-purple-900/50 rounded-3xl p-5 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
          <h3 className="text-sm font-bold text-white">Editar Perfil</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-purple-950/60 border border-purple-600/60 text-xs text-purple-200">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Perfil atualizado com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Avatar Edit */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/60 shadow-lg"
              />
              <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5" />
                <span className="text-[9px] mt-0.5">Alterar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-zinc-500 mr-1">Presets:</span>
              {PRESET_AVATARS.map((preset, i) => (
                <div
                  key={i}
                  onClick={() => setAvatarUrl(preset)}
                  className={`w-7 h-7 rounded-full overflow-hidden cursor-pointer border-2 transition-all ${
                    avatarUrl === preset ? 'border-purple-500 scale-110' : 'border-zinc-800'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1 block">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full bg-zinc-900 text-xs text-white px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-purple-500/70"
            />
          </div>

          {/* Username Field */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1 block">
              Nome de Usuário (@)
            </label>
            <div className="flex items-center bg-zinc-900 rounded-xl border border-zinc-800 px-3 py-2.5 focus-within:border-purple-500/70">
              <span className="text-xs text-zinc-500 font-bold mr-1">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full bg-transparent text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Bio Field */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1 block">Biografia</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre sua vibe..."
              className="w-full bg-zinc-900 text-xs text-white px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-purple-500/70"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};
