import { User, Post, Story, Comment, Message, Conversation, Notification, Report } from '../types';

export const CURRENT_DEMO_USER: User = {
  id: 'u_current',
  name: 'Você (Vibe Creator)',
  username: 'meu_perfil',
  email: 'voce@vibe.app',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  bio: 'Criando momentos únicos na VIBE ✨ Vídeos verticais, viagens & criatividade.',
  birthDate: '1998-05-14',
  isPrivate: false,
  role: 'admin',
  followersCount: 1420,
  followingCount: 382,
  postsCount: 12,
  isVerified: true,
  createdAt: '2024-01-10T10:00:00Z',
  blockedUserIds: []
};

export const MOCK_USERS: User[] = [
  CURRENT_DEMO_USER,
  {
    id: 'u_1',
    name: 'Amanda Oliveira',
    username: 'amandaoliveira',
    email: 'amanda@vibe.app',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    bio: 'Fotografia, viagens & cafezinho ✈️☕️ Vivendo em alta definição.',
    isPrivate: false,
    followersCount: 18400,
    followingCount: 420,
    postsCount: 64,
    isVerified: true,
    createdAt: '2023-11-15T08:30:00Z'
  },
  {
    id: 'u_2',
    name: 'Lucas Ferreira',
    username: 'lucasvibe',
    email: 'lucas@vibe.app',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Skate, beats urbanos e tecnologia 🛹⚡️ SP / Rio',
    isPrivate: false,
    followersCount: 9240,
    followingCount: 610,
    postsCount: 38,
    isVerified: true,
    createdAt: '2024-02-01T12:00:00Z'
  },
  {
    id: 'u_3',
    name: 'Beatriz Lima',
    username: 'beatriz_art',
    email: 'beatriz@vibe.app',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Motion designer & artista 3D 💜 Criando universos no tempo livre.',
    isPrivate: false,
    followersCount: 24500,
    followingCount: 290,
    postsCount: 92,
    isVerified: true,
    createdAt: '2023-08-19T14:15:00Z'
  },
  {
    id: 'u_4',
    name: 'Gabriel Rocha',
    username: 'gabriel_tech',
    email: 'gabriel@vibe.app',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'Inteligência Artificial, gadgets e o futuro da web 🤖📱',
    isPrivate: false,
    followersCount: 5120,
    followingCount: 195,
    postsCount: 27,
    isVerified: false,
    createdAt: '2024-03-05T09:45:00Z'
  },
  {
    id: 'u_5',
    name: 'Camila Santos',
    username: 'camilagourmet',
    email: 'camila@vibe.app',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    bio: 'Receitas rápidas de até 60 segundos que vão mudar seu dia! 🥑🍝',
    isPrivate: false,
    followersCount: 31800,
    followingCount: 350,
    postsCount: 114,
    isVerified: true,
    createdAt: '2023-10-02T16:20:00Z'
  }
];

// Helper to get future or past ISO string
const getRelativeISO = (hoursOffset: number) => {
  const d = new Date();
  d.setTime(d.getTime() + hoursOffset * 60 * 60 * 1000);
  return d.toISOString();
};

export const MOCK_STORIES: Story[] = [
  {
    id: 'st_1',
    userId: 'u_1',
    user: MOCK_USERS[1],
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    textOverlay: 'Nascer do sol perfeito hoje 🌅',
    textColor: '#ffffff',
    sticker: '🔥',
    createdAt: getRelativeISO(-4),
    expiresAt: getRelativeISO(20),
    viewsCount: 342,
    viewedByCurrentUser: false,
    status: 'active'
  },
  {
    id: 'st_2',
    userId: 'u_2',
    user: MOCK_USERS[2],
    mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    mediaType: 'video',
    textOverlay: 'Sessão de skate noturna na pista nova!',
    textColor: '#a855f7',
    sticker: '⚡️',
    createdAt: getRelativeISO(-2),
    expiresAt: getRelativeISO(22),
    viewsCount: 512,
    viewedByCurrentUser: false,
    status: 'active'
  },
  {
    id: 'st_3',
    userId: 'u_3',
    user: MOCK_USERS[3],
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    textOverlay: 'Trabalhando no novo render 3D em neon 💜',
    sticker: '🚀',
    createdAt: getRelativeISO(-8),
    expiresAt: getRelativeISO(16),
    viewsCount: 890,
    viewedByCurrentUser: false,
    status: 'active'
  },
  {
    id: 'st_4',
    userId: 'u_5',
    user: MOCK_USERS[5],
    mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    textOverlay: 'Quem quer essa receita de pizza artesanal? 🍕',
    createdAt: getRelativeISO(-11),
    expiresAt: getRelativeISO(13),
    viewsCount: 1420,
    viewedByCurrentUser: false,
    status: 'active'
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_1',
    userId: 'u_1',
    user: MOCK_USERS[1],
    type: 'video',
    category: 'permanent',
    caption: 'Que lugar incrível! A energia dessa cachoeira recarrega qualquer um. Qual foi a última vez que você se desconectou? 🌿💧',
    mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80',
    duration: 32,
    visibility: 'public',
    createdAt: getRelativeISO(-5),
    viewsCount: 14500,
    likesCount: 2310,
    commentsCount: 184,
    sharesCount: 390,
    savesCount: 512,
    hashtags: ['viagem', 'natureza', 'vibe', 'paz'],
    audioTitle: 'Som original - Amanda Oliveira',
    location: 'Chapada dos Veadeiros, GO',
    status: 'active',
    isLiked: false,
    isSaved: true
  },
  {
    id: 'p_2',
    userId: 'u_2',
    user: MOCK_USERS[2],
    type: 'video',
    category: '24h', // TEMPORARY 24H POST
    caption: 'Manobra nova saindo do forno! Essa publicação fica no ar só por 24 HORAS na VIBE ⏳ Quem viu, viu!',
    mediaUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&auto=format&fit=crop&q=80',
    duration: 24,
    visibility: 'public',
    createdAt: getRelativeISO(-4),
    expiresAt: getRelativeISO(20), // 20 hours remaining
    viewsCount: 8420,
    likesCount: 1240,
    commentsCount: 96,
    sharesCount: 180,
    savesCount: 65,
    hashtags: ['skate', 'vibe24h', 'urban', 'lifestyle'],
    audioTitle: 'Neon Trap Beats - Lucas Vibe',
    location: 'Vale do Anhangabaú, SP',
    status: 'active',
    isLiked: true,
    isSaved: false
  },
  {
    id: 'p_3',
    userId: 'u_3',
    user: MOCK_USERS[3],
    type: 'video',
    category: 'permanent',
    caption: 'Experimentação visual com luzes neon e partículas sonoras. Criado especialmente para a VIBE 💜 Deixe seu feedback nos comentários!',
    mediaUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    duration: 18,
    visibility: 'public',
    createdAt: getRelativeISO(-28),
    viewsCount: 22100,
    likesCount: 4890,
    commentsCount: 340,
    sharesCount: 920,
    savesCount: 1430,
    hashtags: ['arte', 'neon', 'vibe', '3d'],
    audioTitle: 'Cyber Synthwave 2026 - Beatriz Art',
    location: 'Estúdio Criativo',
    status: 'active',
    isLiked: false,
    isSaved: false
  },
  {
    id: 'p_4',
    userId: 'u_5',
    user: MOCK_USERS[5],
    type: 'video',
    category: '24h', // TEMPORARY 24H POST
    caption: 'Sanduíche tostado gourmet em 45 segundos! Receita relâmpago que sai do ar em 24h 🥪✨ Salvem antes que expire!',
    mediaUrl: 'https://cdn.jsdelivr.net/gh/web-platform-tests/wpt@master/media/movie_5.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    duration: 45,
    visibility: 'public',
    createdAt: getRelativeISO(-18),
    expiresAt: getRelativeISO(6), // 6 hours remaining
    viewsCount: 16900,
    likesCount: 3100,
    commentsCount: 215,
    sharesCount: 640,
    savesCount: 890,
    hashtags: ['comida', 'receita', '24h', 'gourmet'],
    audioTitle: 'Acoustic Chill Cooking - Chef Sound',
    location: 'Cozinha Criativa',
    status: 'active',
    isLiked: false,
    isSaved: false
  },
  {
    id: 'p_5',
    userId: 'u_4',
    user: MOCK_USERS[4],
    type: 'video',
    category: 'permanent',
    caption: 'Testei os novos óculos holográficos com IA integrada. O futuro da interface homem-máquina já chegou! 🚀🤖',
    mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&auto=format&fit=crop&q=80',
    duration: 38,
    visibility: 'public',
    createdAt: getRelativeISO(-48),
    viewsCount: 31400,
    likesCount: 5400,
    commentsCount: 680,
    sharesCount: 1200,
    savesCount: 940,
    hashtags: ['tecnologia', 'gadgets', 'ia', 'futuro'],
    audioTitle: 'Tech Beat Future - Gabriel Rocha',
    location: 'Vale do Silício',
    status: 'active',
    isLiked: false,
    isSaved: false
  }
];

export const MOCK_COMMENTS: Record<string, Comment[]> = {
  p_1: [
    {
      id: 'c_1',
      postId: 'p_1',
      userId: 'u_2',
      user: MOCK_USERS[2],
      text: 'Visual surreal! Onde fica essa cachoeira exatamente?',
      createdAt: 'há 4 horas',
      likesCount: 24,
      isLiked: false
    },
    {
      id: 'c_2',
      postId: 'p_1',
      userId: 'u_3',
      user: MOCK_USERS[3],
      text: 'Essa luz dourada na água ficou cinematográfica demais ✨',
      createdAt: 'há 2 horas',
      likesCount: 12,
      isLiked: true
    },
    {
      id: 'c_3',
      postId: 'p_1',
      userId: 'u_current',
      user: CURRENT_DEMO_USER,
      text: 'Sensacional Amanda! Deu muita vontade de viajar pra lá!',
      createdAt: 'há 30 minutos',
      likesCount: 4,
      isLiked: false
    }
  ],
  p_2: [
    {
      id: 'c_4',
      postId: 'p_2',
      userId: 'u_4',
      user: MOCK_USERS[4],
      text: 'Curti a funcionalidade de 24h! Conteúdo exclusivo do dia 🔥',
      createdAt: 'há 3 horas',
      likesCount: 15,
      isLiked: false
    }
  ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n_1',
    userId: 'u_current',
    actorId: 'u_1',
    actor: MOCK_USERS[1],
    type: 'like',
    referenceId: 'p_1',
    referenceText: 'curtiu seu vídeo recente',
    createdAt: 'há 10 minutos'
  },
  {
    id: 'n_2',
    userId: 'u_current',
    actorId: 'u_2',
    actor: MOCK_USERS[2],
    type: 'follow',
    referenceText: 'começou a seguir você',
    createdAt: 'há 45 minutos'
  },
  {
    id: 'n_3',
    userId: 'u_current',
    actorId: 'u_3',
    actor: MOCK_USERS[3],
    type: 'comment',
    referenceId: 'p_3',
    referenceText: 'comentou: "Ficou incrível essa edição!"',
    createdAt: 'há 2 horas'
  },
  {
    id: 'n_4',
    userId: 'u_current',
    actorId: 'u_5',
    actor: MOCK_USERS[5],
    type: 'story',
    referenceText: 'publicou um novo Story imperdível',
    createdAt: 'há 4 horas'
  },
  {
    id: 'n_5',
    userId: 'u_current',
    actorId: 'u_4',
    actor: MOCK_USERS[4],
    type: 'mention',
    referenceText: 'mencionou você em uma publicação sobre IA',
    createdAt: 'há 6 horas'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participant: MOCK_USERS[1],
    lastMessage: {
      id: 'm_1',
      conversationId: 'conv_1',
      senderId: 'u_1',
      receiverId: 'u_current',
      text: 'Bora gravar uma collab semana que vem para a VIBE?',
      createdAt: '14:20',
      status: 'read'
    },
    unreadCount: 0,
    updatedAt: getRelativeISO(-1)
  },
  {
    id: 'conv_2',
    participant: MOCK_USERS[2],
    lastMessage: {
      id: 'm_2',
      conversationId: 'conv_2',
      senderId: 'u_2',
      receiverId: 'u_current',
      text: 'Viu o post temporário que soltei? Expira hoje!',
      createdAt: '11:05',
      status: 'delivered'
    },
    unreadCount: 1,
    updatedAt: getRelativeISO(-3)
  },
  {
    id: 'conv_3',
    participant: MOCK_USERS[3],
    lastMessage: {
      id: 'm_3',
      conversationId: 'conv_3',
      senderId: 'u_current',
      receiverId: 'u_3',
      text: 'Adorei a animação que você postou Beatriz!',
      createdAt: 'Ontem',
      status: 'read'
    },
    unreadCount: 0,
    updatedAt: getRelativeISO(-24)
  }
];

export const MOCK_MESSAGES_MAP: Record<string, Message[]> = {
  conv_1: [
    {
      id: 'msg_1_1',
      conversationId: 'conv_1',
      senderId: 'u_1',
      receiverId: 'u_current',
      text: 'Oi! Tudo bem? Vi seus vídeos recentes na VIBE!',
      createdAt: '14:15',
      status: 'read'
    },
    {
      id: 'msg_1_2',
      conversationId: 'conv_1',
      senderId: 'u_current',
      receiverId: 'u_1',
      text: 'Oi Amanda! Obrigado, fico muito feliz que curtiu!',
      createdAt: '14:18',
      status: 'read'
    },
    {
      id: 'msg_1_3',
      conversationId: 'conv_1',
      senderId: 'u_1',
      receiverId: 'u_current',
      text: 'Bora gravar uma collab semana que vem para a VIBE?',
      createdAt: '14:20',
      status: 'read'
    }
  ],
  conv_2: [
    {
      id: 'msg_2_1',
      conversationId: 'conv_2',
      senderId: 'u_2',
      receiverId: 'u_current',
      text: 'E aí mano! Tranquilo?',
      createdAt: '10:55',
      status: 'read'
    },
    {
      id: 'msg_2_2',
      conversationId: 'conv_2',
      senderId: 'u_2',
      receiverId: 'u_current',
      text: 'Viu o post temporário que soltei? Expira hoje!',
      createdAt: '11:05',
      status: 'delivered'
    }
  ],
  conv_3: [
    {
      id: 'msg_3_1',
      conversationId: 'conv_3',
      senderId: 'u_current',
      receiverId: 'u_3',
      text: 'Adorei a animação que você postou Beatriz!',
      createdAt: 'Ontem 18:00',
      status: 'read'
    }
  ]
};

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rep_1',
    reporterId: 'u_2',
    targetType: 'post',
    targetId: 'p_5',
    reason: 'Spam',
    description: 'Possível post repetido com links externos',
    status: 'pending',
    createdAt: getRelativeISO(-6)
  },
  {
    id: 'rep_2',
    reporterId: 'u_1',
    targetType: 'comment',
    targetId: 'c_99',
    reason: 'Conteúdo inadequado',
    description: 'Linguagem ofensiva nos comentários',
    status: 'pending',
    createdAt: getRelativeISO(-12)
  }
];

export const EXPLORE_CATEGORIES = [
  'Em alta',
  'Humor',
  'Música',
  'Games',
  'Esportes',
  'Moda',
  'Beleza',
  'Viagens',
  'Comida',
  'Tecnologia',
  'Entretenimento'
];

export const POPULAR_HASHTAGS = [
  { tag: 'vibe', count: '1.4M' },
  { tag: 'viagem', count: '890K' },
  { tag: 'vibe24h', count: '540K' },
  { tag: 'natureza', count: '410K' },
  { tag: 'musica', count: '380K' },
  { tag: 'games', count: '290K' },
  { tag: 'tecnologia', count: '195K' },
  { tag: 'arte', count: '160K' }
];
