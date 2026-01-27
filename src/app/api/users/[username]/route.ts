import { NextResponse } from 'next/server';

// Mock tracks data
const getMockTracks = (userId: string, username: string) => {
  return [
    {
      id: `${userId}-track-1`,
      userId: userId,
      user: {
        id: userId,
        username: username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1).replace(/[0-9]/g, ''),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        followersCount: Math.floor(Math.random() * 10000),
        followingCount: Math.floor(Math.random() * 1000),
        tracksCount: Math.floor(Math.random() * 50),
      },
      title: "Summer Vibes",
      description: "Just vibing on this summer track ☀️",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      durationSeconds: 185,
      likesCount: 1247,
      commentsCount: 89,
      remixesCount: 12,
      createdAt: "2025-01-15T10:30:00Z",
      tags: ["summer", "chill", "beats"],
    },
    {
      id: `${userId}-track-2`,
      userId: userId,
      user: {
        id: userId,
        username: username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1).replace(/[0-9]/g, ''),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        followersCount: Math.floor(Math.random() * 10000),
        followingCount: Math.floor(Math.random() * 1000),
        tracksCount: Math.floor(Math.random() * 50),
      },
      title: "Midnight Dreams",
      description: "Late night studio session 🎹",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      durationSeconds: 210,
      likesCount: 2340,
      commentsCount: 156,
      remixesCount: 8,
      createdAt: "2025-01-14T22:15:00Z",
      isMain: true,
    },
    {
      id: `${userId}-track-3`,
      userId: userId,
      user: {
        id: userId,
        username: username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1).replace(/[0-9]/g, ''),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        followersCount: Math.floor(Math.random() * 10000),
        followingCount: Math.floor(Math.random() * 1000),
        tracksCount: Math.floor(Math.random() * 50),
      },
      title: "Urban Flow",
      description: "Street beats for the soul 🎤",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      durationSeconds: 168,
      likesCount: 5600,
      commentsCount: 234,
      remixesCount: 45,
      createdAt: "2025-01-13T18:45:00Z",
    },
  ];
};

// GET /api/users/:username - Get user profile with tracks
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    // In production, this would fetch from the actual backend
    // For now, return mock data based on username
    const username = params.username;
    const userId = `user-${username}`;
    
    // Simulate user data
    const userData = {
      id: userId,
      username: username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1).replace(/[0-9]/g, ''),
      email: `${username}@example.com`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: 'Music creator on JamSync 🎵',
      followersCount: Math.floor(Math.random() * 10000),
      followingCount: Math.floor(Math.random() * 1000),
      tracksCount: 3, // Always return at least 3 tracks for demo
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Get mock tracks for this user
    const tracks = getMockTracks(userId, username);

    // Return in the format expected by the profile page
    return NextResponse.json({
      user: userData,
      tracks: tracks,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PUT /api/users/:username - Update profile
export async function PUT(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const body = await request.json();
    // TODO: Replace with actual API call
    return NextResponse.json({
      id: 'user-id',
      username: params.username,
      ...body,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
