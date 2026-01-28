import { NextResponse } from 'next/server';

// Realistic trending track data
const TRENDING_TRACKS = [
  { title: 'Midnight City Dreams', artist: 'Neon Horizons', tags: ['trending', 'hot', 'synthwave'] },
  { title: 'Turn Up The Bass', artist: 'Kevin Bass', tags: ['trending', 'hot', 'edm'] },
  { title: 'Electric Soul', artist: 'Synth Dreams', tags: ['trending', 'viral', 'electronic'] },
  { title: 'Dance All Night', artist: 'House Head', tags: ['trending', 'hot', 'house'] },
  { title: 'Lagos Nights', artist: 'Afro Beat King', tags: ['trending', 'hot', 'afrobeats'] },
  { title: 'Neon Nights', artist: 'Luna Wave', tags: ['trending', 'viral', 'synthwave'] },
  { title: 'Streets Remember', artist: 'Trap Soul', tags: ['trending', 'hot', 'trap'] },
  { title: 'City Lights', artist: 'The Midnight Collective', tags: ['trending', 'viral', 'electronic'] },
  { title: 'Cloud Nine', artist: 'Lofi Dreams', tags: ['trending', 'hot', 'lofi'] },
  { title: 'Dale', artist: 'DJ Sol', tags: ['trending', 'viral', 'reggaeton'] },
  { title: 'Hype Beast', artist: 'Trap Master', tags: ['trending', 'hot', 'bass'] },
  { title: 'Nights Like This', artist: 'Aaliyah Brooks', tags: ['trending', 'viral', 'rnb'] },
  { title: 'Ocean Waves', artist: 'Luna Beats', tags: ['trending', 'hot', 'lofi'] },
  { title: 'Breaking Free', artist: 'Thunder Road', tags: ['trending', 'hot', 'rock'] },
  { title: 'Urban Dreams', artist: 'Beat Society', tags: ['trending', 'viral', 'hiphop'] },
];

const ARTIST_SEEDS: Record<string, string> = {
  'Neon Horizons': 'neonhorizons',
  'Kevin Bass': 'bassdropkevin',
  'Synth Dreams': 'synthdreams',
  'House Head': 'househead',
  'Afro Beat King': 'afrobeat',
  'Luna Wave': 'lunawave',
  'Trap Soul': 'trapsoul',
  'The Midnight Collective': 'midnightcollective',
  'Lofi Dreams': 'lofidreams',
  'DJ Sol': 'reggaeton_vibes',
  'Trap Master': 'trapmaster',
  'Aaliyah Brooks': 'rnb_smooth',
  'Luna Beats': 'lunabeats',
  'Thunder Road': 'thunderroad',
  'Beat Society': 'beatsociety',
};

// Generate realistic trending tracks
const generateTrendingTracks = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const trackIndex = i % TRENDING_TRACKS.length;
    const trackData = TRENDING_TRACKS[trackIndex];
    const artistSeed = ARTIST_SEEDS[trackData.artist] || trackData.artist.toLowerCase().replace(/\s+/g, '');
    
    return {
      id: `trending-${Date.now()}-${i}`,
      userId: `user-${artistSeed}`,
      user: {
        id: `user-${artistSeed}`,
        username: artistSeed,
        displayName: trackData.artist,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${artistSeed}`,
        followersCount: Math.floor(Math.random() * 500000) + 10000,
        followingCount: Math.floor(Math.random() * 500) + 50,
        tracksCount: Math.floor(Math.random() * 100) + 10,
      },
      title: trackData.title,
      description: `Viral hit by ${trackData.artist} 🔥`,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      videoUrl: i % 2 === 0 ? 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' : undefined,
      durationSeconds: 180 + Math.floor(Math.random() * 120),
      likesCount: 100000 + Math.floor(Math.random() * 900000),
      commentsCount: 5000 + Math.floor(Math.random() * 10000),
      remixesCount: Math.floor(Math.random() * 500),
      createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: trackData.tags,
    };
  });
};

// GET /api/feed/trending - Get trending tracks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  // Return mock data directly - no external backend needed
  const tracks = generateTrendingTracks(limit);

  return NextResponse.json({
    tracks,
    nextCursor: offset + limit,
    hasMore: offset + limit < 100,
    timeRange: searchParams.get('timeRange') || 'all',
  });
}
