import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// GET /api/feed - Get personalized timeline
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '10';
  const offset = searchParams.get('offset') || '0';

  try {
    const response = await fetch(`${API_BASE_URL}/feed?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Feed API error:', error);
    return NextResponse.json(
      { tracks: [], hasMore: false, error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
