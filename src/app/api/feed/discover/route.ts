import { NextResponse } from 'next/server';

// Genre tags for discover
const GENRES = ['Hip Hop', 'Electronic', 'Rock', 'Pop', 'R&B', 'Jazz', 'LoFi', 'Afrobeats', 'Indie'];

// Realistic discover track data
const DISCOVER_TRACKS = [
  { title: 'Neon Nights', artist: 'SynthWave Queen', genre: 'Electronic' },
  { title: 'Pastel Memories', artist: 'Velvet Echo', genre: 'Electronic' },
  { title: 'Sunset Boulevard', artist: 'Coastal Vibes', genre: 'Electronic' },
  { title: 'Urban Dreams', artist: 'Beat Society', genre: 'Hip Hop' },
  { title: 'Streets Remember', artist: 'Trap Soul', genre: 'Hip Hop' },
  { title: 'Midnight Drive', artist: 'Night Owl', genre: 'Electronic' },
  { title: 'Wildflower', artist: 'Indie Vibes', genre: 'Indie' },
  { title: 'Golden Hour', artist: 'Maya Rivera', genre: 'Indie' },
  { title: 'Crystal Clear', artist: 'Echo Valley', genre: 'Rock' },
  { title: 'Breaking Free', artist: 'Thunder Road', genre: 'Rock' },
  { title: 'Nights Like This', artist: 'Aaliyah Brooks', genre: 'R&B' },
  { title: 'Coffee Shop Sessions', artist: 'The Jazz Cats', genre: 'Jazz' },
  { title: 'Ocean Waves', artist: 'Luna Beats', genre: 'LoFi' },
  { title: 'Cloud Nine', artist: 'Lofi Dreams', genre: 'LoFi' },
  { title: 'Lagos Nights', artist: 'Afro Beat King', genre: 'Afrobeats' },
  { title: 'Dale', artist: 'DJ Sol', genre: 'Afrobeats' },
  { title: 'Electric Soul', artist: 'Synth Dreams', genre: 'Pop' },
  { title: 'Rainy Day', artist: 'LoFi Chill', genre: 'LoFi' },
  { title: 'City Lights', artist: 'The Midnight Collective', genre: 'Pop' },
  { title: 'Sunday Morning', artist: 'The Chill Collective', genre: 'Jazz' },
];

const ARTIST_SEEDS: Record<string, string> = {
  'SynthWave Queen': 'synthwave_queen',
  'Velvet Echo': 'velvetecho',
  'Coastal Vibes': 'coastalvibes',
  'Beat Society': 'beatsociety',
  'Trap Soul': 'trapsoul',
  'Night Owl': 'nightowl',
  'Indie Vibes': 'indievibes',
  'Maya Rivera': 'acoustic_soul',
  'Echo Valley': 'echovalley',
  'Thunder Road': 'thunderroad',
  'Aaliyah Brooks': 'rnb_smooth',
  'The Jazz Cats': 'jazzcats',
  'Luna Beats': 'lunabeats',
  'Lofi Dreams': 'lofidreams',
  'Afro Beat King': 'afrobeat',
  'DJ Sol': 'reggaeton_vibes',
  'Synth Dreams': 'synthdreams',
  'LoFi Chill': 'lofi_chill',
  'The Midnight Collective': 'midnightcollective',
  'The Chill Collective': 'chillcollective',
};

// Generate realistic discover tracks
const generateDiscoverTracks = (count: number, genre?: string | null) => {
  return Array.from({ length: count }, (_, i) => {
    const trackIndex = i % DISCOVER_TRACKS.length;
    let trackData = DISCOVER_TRACKS[trackIndex];
    
    // Filter by genre if specified
    if (genre && genre !== 'All') {
      const genreTracks = DISCOVER_TRACKS.filter(t => t.genre === genre);
      if (genreTracks.length > 0) {
        trackData = genreTracks[trackIndex % genreTracks.length];
      }
    }
    
    const artistSeed = ARTIST_SEEDS[trackData.artist] || trackData.artist.toLowerCase().replace(/\s+/g, '');
    
    return {
      id: `discover-${Date.now()}-${i}`,
      userId: `user-${artistSeed}`,
      user: {
        id: `user-${artistSeed}`,
        username: artistSeed,
        displayName: trackData.artist,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${artistSeed}`,
        followersCount: Math.floor(Math.random() * 100000) + 500,
        followingCount: Math.floor(Math.random() * 500) + 50,
        tracksCount: Math.floor(Math.random() * 50) + 5,
      },
      title: trackData.title,
      description: `New ${trackData.genre.toLowerCase()} release by ${trackData.artist} ✨`,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      videoUrl: Math.random() > 0.5 ? 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' : undefined,
      durationSeconds: 180 + Math.floor(Math.random() * 120),
      likesCount: Math.floor(Math.random() * 50000) + 100,
      commentsCount: Math.floor(Math.random() * 2000) + 10,
      remixesCount: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      tags: [trackData.genre.toLowerCase(), 'new', 'discover'],
    };
  });
};

// GET /api/feed/discover - Discover new tracks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const genre = searchParams.get('genre');

  // Return mock data directly - no external backend needed
  const tracks = generateDiscoverTracks(limit, genre);

  return NextResponse.json({
    tracks,
    nextCursor: offset + limit,
    hasMore: offset + limit < 200,
    genre: genre || 'All',
    availableGenres: GENRES,
  });
}
