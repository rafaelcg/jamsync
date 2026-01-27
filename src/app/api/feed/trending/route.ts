import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// GET /api/feed/trending - Get trending tracks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '10';
  const offset = searchParams.get('offset') || '0';
  const timeRange = searchParams.get('timeRange') || 'all';

  try {
    const response = await fetch(`${API_BASE_URL}/feed/trending?limit=${limit}&offset=${offset}&timeRange=${timeRange}`, {
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
    console.error('Trending API error:', error);
    return NextResponse.json(
      { tracks: [], error: 'Failed to fetch trending tracks' },
      { status: 500 }
    );
  }
}
