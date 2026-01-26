import { NextResponse } from 'next/server';

// POST /api/auth/register - User registration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Replace with actual API call
    return NextResponse.json({
      user: {
        id: 'new-user-id',
        username: body.username,
        email: body.email,
        avatarUrl: '',
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date().toISOString(),
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
