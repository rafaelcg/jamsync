import { NextResponse } from 'next/server';

// Generate mock trending tracks
const generateTrendingTracks = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `trending-${Date.now()}-${i}`,
    userId: `user-${i}`,
    user: {
      id: `user-${i}`,
      username: `trending_creator_${i}`,
      displayName: `Trending Artist ${i + 1}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=trending${i}`,
      followersCount: Math.floor(Math.random() * 100000),
      followingCount: Math.floor(Math.random() * 500),
      tracksCount: Math.floor(Math.random() * 100),
    },
    title: `Viral Hit ${i + 1} 🔥`,
    description: 'This track is blowing up!',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: i % 2 === 0 ? 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' : undefined,
    durationSeconds: 150 + Math.floor(Math.random() * 180),
    likesCount: 100000 + Math.floor(Math.random() * 900000),
    commentsCount: 5000 + Math.floor(Math.random() * 10000),
    remixesCount: Math.floor(Math.random() * 500),
    createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['trending', 'hot', 'viral'],
  }));
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
