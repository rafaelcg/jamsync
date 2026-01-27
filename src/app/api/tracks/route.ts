import { NextResponse } from 'next/server';

// Generate mock tracks
const generateTracks = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `track-${Date.now()}-${i}`,
    userId: 'current-user',
    user: {
      id: 'current-user',
      username: 'musicmaker',
      displayName: 'Music Maker',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music',
      followersCount: Math.floor(Math.random() * 10000),
      followingCount: Math.floor(Math.random() * 500),
      tracksCount: count,
    },
    title: `My Track ${i + 1}`,
    description: 'My awesome track',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    durationSeconds: 180 + Math.floor(Math.random() * 120),
    likesCount: Math.floor(Math.random() * 10000),
    commentsCount: Math.floor(Math.random() * 500),
    remixesCount: Math.floor(Math.random() * 20),
    createdAt: new Date().toISOString(),
    tags: ['my-tracks'],
  }));
};

// GET /api/tracks - List tracks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  // Return mock data directly
  const tracks = generateTracks(limit);

  return NextResponse.json({
    tracks,
    nextCursor: undefined,
    hasMore: false,
  });
}

// POST /api/tracks - Create new track (mock)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Return mock created track
    return NextResponse.json({
      id: `new-track-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
