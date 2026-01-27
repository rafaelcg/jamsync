import { NextResponse } from 'next/server';

// Generate mock tracks for feed
const generateMockTracks = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `feed-track-${Date.now()}-${i}`,
    userId: `user-${i}`,
    user: {
      id: `user-${i}`,
      username: `creator_${i}`,
      displayName: `Creator ${i + 1}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=creator${i}`,
      followersCount: Math.floor(Math.random() * 50000),
      followingCount: Math.floor(Math.random() * 1000),
      tracksCount: Math.floor(Math.random() * 50),
    },
    title: `Trending Track ${i + 1}`,
    description: 'Check out this amazing track! 🎵',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: i % 3 === 0 ? 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' : undefined,
    durationSeconds: 180 + Math.floor(Math.random() * 120),
    likesCount: Math.floor(Math.random() * 100000),
    commentsCount: Math.floor(Math.random() * 5000),
    remixesCount: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['trending', 'viral', 'new'],
  }));
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
