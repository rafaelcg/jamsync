import { NextResponse } from 'next/server';

// POST /api/auth/login - User login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Replace with actual API call
    return NextResponse.json({
      user: {
        id: 'user-id',
        username: body.email?.split('@')[0] || 'user',
        email: body.email,
        avatarUrl: '',
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date().toISOString(),
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
