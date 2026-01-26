import { NextResponse } from 'next/server';

// GET /api/users/:username - Get user profile
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    // In production, this would fetch from the actual backend
    // For now, return mock data based on username
    const username = params.username;
    
    // Simulate user data
    const userData = {
      id: `user-${username}`,
      username: username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1).replace(/[0-9]/g, ''),
      email: `${username}@example.com`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: 'Music creator on JamSync 🎵',
      followersCount: Math.floor(Math.random() * 10000),
      followingCount: Math.floor(Math.random() * 1000),
      tracksCount: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json(userData);
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
