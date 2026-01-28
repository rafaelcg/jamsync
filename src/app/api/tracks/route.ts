import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demo (replace with database in production)
interface Track {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  title: string;
  description?: string;
  audioUrl: string;
  videoUrl?: string;
  durationSeconds: number;
  likesCount: number;
  commentsCount: number;
  remixesCount: number;
  createdAt: string;
  tags?: string[];
}

// In-memory track storage
const tracks: Map<string, Track> = new Map();

// Initialize with realistic sample tracks
function initializeSampleTracks() {
  if (tracks.size > 0) return;

  const sampleTracks: Track[] = [
    {
      id: 'track-1',
      userId: 'user-beatmakerpro',
      user: {
        id: 'user-beatmakerpro',
        username: 'beatmaker_pro',
        displayName: 'BeatMaker Pro',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaker',
      },
      title: 'Summer Vibes',
      description: 'Chill beats for summer days ☀️',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      durationSeconds: 245,
      likesCount: 245000,
      commentsCount: 1250,
      remixesCount: 45,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      tags: ['summer', 'chill', 'beats'],
    },
    {
      id: 'track-2',
      userId: 'user-synthwavequeen',
      user: {
        id: 'user-synthwavequeen',
        username: 'synthwave_queen',
        displayName: 'SynthWave Queen',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=synthwave',
      },
      title: 'Neon Dreams',
      description: 'Drive into the night 🌆',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      durationSeconds: 280,
      likesCount: 189000,
      commentsCount: 890,
      remixesCount: 32,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      tags: ['synthwave', 'electronic', 'retro', '80s'],
    },
    {
      id: 'track-3',
      userId: 'user-lofichill',
      user: {
        id: 'user-lofichill',
        username: 'lofi_chill',
        displayName: 'LoFi Chill',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lofi',
      },
      title: 'Rainy Day Study',
      description: 'Perfect for focusing 📚',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      durationSeconds: 180,
      likesCount: 456000,
      commentsCount: 2340,
      remixesCount: 67,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      tags: ['lofi', 'chill', 'study', 'rain'],
    },
    {
      id: 'track-4',
      userId: 'user-trapmaster',
      user: {
        id: 'user-trapmaster',
        username: 'trap_master',
        displayName: 'Trap Master',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trap',
      },
      title: 'Hype Beast',
      description: 'Turn up the volume to the max 🔥',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      durationSeconds: 165,
      likesCount: 312000,
      commentsCount: 1560,
      remixesCount: 89,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      tags: ['trap', 'hiphop', 'bass', 'hype'],
    },
    {
      id: 'track-5',
      userId: 'user-housevibes',
      user: {
        id: 'user-housevibes',
        username: 'house_vibes',
        displayName: 'House Vibes',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=house',
      },
      title: 'Dance All Night',
      description: 'The club is calling 🏠',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      durationSeconds: 320,
      likesCount: 198000,
      commentsCount: 980,
      remixesCount: 45,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      tags: ['house', 'dance', 'club', 'electronic'],
    },
  ];

  sampleTracks.forEach(track => tracks.set(track.id, track));
}

initializeSampleTracks();

// Realistic mock track names and artist names for demo
const REALISTIC_TRACKS = [
  { title: 'Midnight City Dreams', artist: 'Neon Horizons', tags: ['synthwave', 'electronic', '80s'] },
  { title: 'Sunday Morning Coffee', artist: 'The Jazz Cats', tags: ['jazz', 'instrumental', 'chill'] },
  { title: 'Ocean Waves', artist: 'Luna Beats', tags: ['lofi', 'chill', 'study'] },
  { title: 'Turn Up The Bass', artist: 'Kevin Bass', tags: ['edm', 'bass', 'house'] },
  { title: 'Heartstrings', artist: 'Maya Rivera', tags: ['acoustic', 'folk', 'indie'] },
  { title: 'Streets Remember', artist: 'Trap King', tags: ['trap', 'hiphop', 'dark'] },
  { title: 'Celestial Dreams', artist: 'Pandora', tags: ['ambient', 'electronic', 'dreamy'] },
  { title: 'Dale', artist: 'DJ Sol', tags: ['reggaeton', 'latin', 'dance'] },
  { title: 'Breaking Free', artist: 'Thunder Road', tags: ['rock', 'guitar', 'anthem'] },
  { title: 'Golden Hour', artist: 'The Chill Collective', tags: ['chill', 'indie', 'summer'] },
  { title: 'Nights Like This', artist: 'Aaliyah Brooks', tags: ['rnb', 'soul', 'smooth'] },
  { title: 'Wildflower', artist: 'Rose Wilson', tags: ['indie', 'folk', 'acoustic'] },
  { title: 'Neon Lights', artist: 'SynthWave Queen', tags: ['synthwave', 'retro', 'electronic'] },
  { title: 'Rainy Day Study', artist: 'LoFi Chill', tags: ['lofi', 'study', 'chill'] },
  { title: 'Hype Beast', artist: 'Trap Master', tags: ['trap', 'bass', 'hype'] },
  { title: 'Dance All Night', artist: 'House Vibes', tags: ['house', 'dance', 'club'] },
  { title: 'Coffee Shop Sessions', artist: 'Jazz Hop Collective', tags: ['jazz', 'chill', 'instrumental'] },
  { title: 'Blue Notes', artist: 'Smooth Jazz Project', tags: ['jazz', 'smooth', 'piano'] },
  { title: 'Dusty Memories', artist: 'Vinyl Lofi', tags: ['lofi', 'vinyl', 'nostalgic'] },
  { title: 'Afro Beat Party', artist: 'Afro King', tags: ['afrobeats', 'dance', 'party'] },
  { title: 'Lagos Nights', artist: 'Naija Vibes', tags: ['afrobeats', 'amapiano', 'naija'] },
  { title: 'Electric Dreams', artist: 'Fusion Masters', tags: ['jazz', 'fusion', 'electronic'] },
  { title: 'Cloud Nine', artist: 'Dreamy Lofi', tags: ['lofi', 'dreamy', 'chill'] },
  { title: 'Highlife Sunset', artist: 'Ghana Flow', tags: ['afrobeats', 'highlife', 'african'] },
  { title: 'Shadow Realm', artist: 'Metal Thunder', tags: ['rock', 'metal', 'heavy'] },
];

const ARTIST_AVATARS: Record<string, string> = {
  'Neon Horizons': 'neonhorizons',
  'The Jazz Cats': 'jazzcats',
  'Luna Beats': 'lunabeats',
  'Kevin Bass': 'bassdropkevin',
  'Maya Rivera': 'acoustic_soul',
  'Trap King': 'trapking',
  'Pandora': 'pandora_box',
  'DJ Sol': 'reggaeton_vibes',
  'Thunder Road': 'rock_anthem',
  'The Chill Collective': 'chill_collective',
  'Aaliyah Brooks': 'rnb_smooth',
  'Rose Wilson': 'indie_rose',
  'SynthWave Queen': 'synthwave_queen',
  'LoFi Chill': 'lofi_chill',
  'Trap Master': 'trap_master',
  'House Vibes': 'house_vibes',
  'Jazz Hop Collective': 'jazzcats',
  'Smooth Jazz Project': 'smoothjazz',
  'Vinyl Lofi': 'vinyl_lofi',
  'Afro King': 'afroking',
  'Naija Vibes': 'naijavibes',
  'Fusion Masters': 'fusionmasters',
  'Dreamy Lofi': 'dreamylofi',
  'Ghana Flow': 'ghanaflow',
  'Metal Thunder': 'metalthunder',
};

// Generate mock tracks with realistic data
const generateTracks = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const trackIndex = i % REALISTIC_TRACKS.length;
    const trackData = REALISTIC_TRACKS[trackIndex];
    const artistSeed = ARTIST_AVATARS[trackData.artist] || trackData.artist.toLowerCase().replace(/\s+/g, '');
    
    return {
      id: `mock-track-${Date.now()}-${i}`,
      userId: `user-${artistSeed}`,
      user: {
        id: `user-${artistSeed}`,
        username: artistSeed,
        displayName: trackData.artist,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${artistSeed}`,
        followersCount: Math.floor(Math.random() * 500000) + 1000,
        followingCount: Math.floor(Math.random() * 1000) + 50,
      },
      title: trackData.title,
      description: `Original track by ${trackData.artist}`,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      videoUrl: i % 3 === 0 ? 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' : undefined,
      durationSeconds: 180 + Math.floor(Math.random() * 180),
      likesCount: Math.floor(Math.random() * 500000) + 100,
      commentsCount: Math.floor(Math.random() * 5000) + 10,
      remixesCount: Math.floor(Math.random() * 200),
      createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      tags: trackData.tags,
    };
  });
};

// GET /api/tracks - List tracks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const userId = searchParams.get('userId');

  // If userId is specified, return stored tracks for that user
  if (userId) {
    const userTracks = Array.from(tracks.values())
      .filter(track => track.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return NextResponse.json({
      tracks: userTracks,
      nextCursor: undefined,
      hasMore: false,
    });
  }

  // Return stored tracks first, then fill with mock data
  const storedTracks = Array.from(tracks.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const remainingSlots = Math.max(0, limit - storedTracks.length);
  const mockTracks = remainingSlots > 0 ? generateTracks(remainingSlots) : [];

  return NextResponse.json({
    tracks: [...storedTracks, ...mockTracks],
    nextCursor: undefined,
    hasMore: false,
  });
}

// POST /api/tracks - Create new track
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { title, description, audioUrl, videoUrl, durationSeconds, userId, tags } = body;

    if (!title || !audioUrl || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, audioUrl, userId' },
        { status: 400 }
      );
    }

    // Create track in our storage
    const track: Track = {
      id: `track-${uuidv4()}`,
      userId,
      user: {
        id: userId,
        username: body.username || 'user',
        displayName: body.displayName || 'User',
        avatarUrl: body.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      },
      title,
      description,
      audioUrl,
      videoUrl,
      durationSeconds: durationSeconds || 0,
      likesCount: 0,
      commentsCount: 0,
      remixesCount: 0,
      createdAt: new Date().toISOString(),
      tags,
    };

    tracks.set(track.id, track);

    return NextResponse.json(track, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
