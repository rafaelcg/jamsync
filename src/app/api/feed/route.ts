import { NextResponse } from 'next/server';

// Realistic track data for feed
const REALISTIC_TRACKS = [
  { title: 'Midnight City Dreams', artist: 'Neon Horizons', tags: ['synthwave', 'electronic', '80s'] },
  { title: 'Ocean Waves', artist: 'Luna Beats', tags: ['lofi', 'chill', 'study'] },
  { title: 'Turn Up The Bass', artist: 'Kevin Bass', tags: ['edm', 'bass', 'house'] },
  { title: 'Pastel Memories', artist: 'Velvet Echo', tags: ['electronic', 'ambient', 'dreamy'] },
  { title: 'Sunset Boulevard', artist: 'Coastal Vibes', tags: ['chill', 'house', 'summer'] },
  { title: 'Midnight Drive', artist: 'Night Owl', tags: ['synthwave', 'electronic', 'night'] },
  { title: 'Electric Soul', artist: 'Synth Dreams', tags: ['synthpop', 'electronic', 'dance'] },
  { title: 'Urban Dreams', artist: 'Beat Society', tags: ['hiphop', 'urban', 'chill'] },
  { title: 'Golden Hour', artist: 'Maya Rivera', tags: ['acoustic', 'folk', 'indie'] },
  { title: 'Crystal Clear', artist: 'Echo Valley', tags: ['indie', 'rock', 'acoustic'] },
  { title: 'Coffee Shop Sessions', artist: 'The Jazz Cats', tags: ['jazz', 'smooth', 'instrumental'] },
  { title: 'City Lights', artist: 'The Midnight Collective', tags: ['electronic', 'urban', 'night'] },
  { title: 'Neon Nights', artist: 'Luna Wave', tags: ['synthwave', 'electronic', 'retro'] },
  { title: 'Streets Remember', artist: 'Trap Soul', tags: ['trap', 'hiphop', 'dark'] },
  { title: 'Dance All Night', artist: 'House Head', tags: ['house', 'dance', 'club'] },
  { title: 'Wildflower', artist: 'Indie Vibes', tags: ['indie', 'folk', 'acoustic'] },
  { title: 'Nights Like This', artist: 'Aaliyah Brooks', tags: ['rnb', 'soul', 'smooth'] },
  { title: 'Lagos Nights', artist: 'Afro Beat King', tags: ['afrobeats', 'dance', 'african'] },
  { title: 'Cloud Nine', artist: 'Lofi Dreams', tags: ['lofi', 'chill', 'sleep'] },
  { title: 'Breaking Free', artist: 'Thunder Road', tags: ['rock', 'guitar', 'anthem'] },
  { title: 'Sunday Morning', artist: 'The Chill Collective', tags: ['chill', 'lofi', 'morning'] },
  { title: 'Dale', artist: 'DJ Sol', tags: ['reggaeton', 'latin', 'dance'] },
  { title: 'Rainy Day', artist: 'LoFi Chill', tags: ['lofi', 'chill', 'study'] },
  { title: 'Hype Beast', artist: 'Trap Master', tags: ['trap', 'bass', 'hype'] },
  { title: 'Neon Lights', artist: 'SynthWave Queen', tags: ['synthwave', 'retro', 'electronic'] },
];

const ARTIST_SEEDS: Record<string, string> = {
  'Neon Horizons': 'neonhorizons',
  'Luna Beats': 'lunabeats',
  'Kevin Bass': 'bassdropkevin',
  'Velvet Echo': 'velvetecho',
  'Coastal Vibes': 'coastalvibes',
  'Night Owl': 'nightowl',
  'Synth Dreams': 'synthdreams',
  'Beat Society': 'beatsociety',
  'Maya Rivera': 'acoustic_soul',
  'Echo Valley': 'echovalley',
  'The Jazz Cats': 'jazzcats',
  'The Midnight Collective': 'midnightcollective',
  'Luna Wave': 'lunawave',
  'Trap Soul': 'trapsoul',
  'House Head': 'househead',
  'Indie Vibes': 'indievibes',
  'Aaliyah Brooks': 'rnb_smooth',
  'Afro Beat King': 'afrobeat',
  'Lofi Dreams': 'lofidreams',
  'Thunder Road': 'thunderroad',
  'The Chill Collective': 'chillcollective',
  'DJ Sol': 'reggaeton_vibes',
  'LoFi Chill': 'lofi_chill',
  'Trap Master': 'trap_master',
  'SynthWave Queen': 'synthwave_queen',
};

// Generate realistic mock tracks for feed
const generateMockTracks = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const trackIndex = i % REALISTIC_TRACKS.length;
    const trackData = REALISTIC_TRACKS[trackIndex];
    const artistSeed = ARTIST_SEEDS[trackData.artist] || trackData.artist.toLowerCase().replace(/\s+/g, '');
    
    return {
      id: `feed-track-${Date.now()}-${i}`,
      userId: `user-${artistSeed}`,
      user: {
        id: `user-${artistSeed}`,
        username: artistSeed,
        displayName: trackData.artist,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${artistSeed}`,
        followersCount: Math.floor(Math.random() * 500000) + 1000,
        followingCount: Math.floor(Math.random() * 1000) + 50,
        tracksCount: Math.floor(Math.random() * 100) + 5,
      },
      title: trackData.title,
      description: `Original track by ${trackData.artist} 🎵`,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      videoUrl: i % 3 === 0 ? 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' : undefined,
      durationSeconds: 180 + Math.floor(Math.random() * 180),
      likesCount: Math.floor(Math.random() * 500000) + 100,
      commentsCount: Math.floor(Math.random() * 10000) + 10,
      remixesCount: Math.floor(Math.random() * 200),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      tags: trackData.tags,
    };
  });
};

// GET /api/feed - Get personalized timeline
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  // Return mock data directly - no external backend needed
  const tracks = generateMockTracks(limit);

  return NextResponse.json({
    tracks,
    nextCursor: offset + limit,
    hasMore: offset + limit < 100,
  });
}
