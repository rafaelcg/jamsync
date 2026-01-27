import { NextResponse } from 'next/server';

// Genre tags for discover
const GENRES = ['Hip Hop', 'Electronic', 'Rock', 'Pop', 'R&B', 'Jazz', 'Classical', 'LoFi', 'Afrobeats', 'Indie'];

// Generate mock discover tracks
const generateDiscoverTracks = (count: number, genre?: string | null) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `discover-${Date.now()}-${i}`,
    userId: `user-${i}`,
    user: {
      id: `user-${i}`,
      username: `discover_creator_${i}`,
      displayName: `New Artist ${i + 1}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=discover${i}`,
      followersCount: Math.floor(Math.random() * 10000),
      followingCount: Math.floor(Math.random() * 500),
      tracksCount: Math.floor(Math.random() * 20),
    },
    title: `Fresh Track ${i + 1} ✨`,
    description: genre ? `New ${genre.toLowerCase()} release` : 'Brand new music discovered',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: Math.random() > 0.5 ? 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' : undefined,
    durationSeconds: 180 + Math.floor(Math.random() * 120),
    likesCount: Math.floor(Math.random() * 50000),
    commentsCount: Math.floor(Math.random() * 2000),
    remixesCount: Math.floor(Math.random() * 50),
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    tags: genre ? [genre.toLowerCase(), 'new', 'discover'] : ['new', 'discover', 'fresh'],
  }));
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
