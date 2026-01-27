import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// GET /api/feed/discover - Discover new tracks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '20';
  const offset = searchParams.get('offset') || '0';
  const genre = searchParams.get('genre');

  try {
    const queryParams = new URLSearchParams({
      limit,
      offset,
      ...(genre && { genre }),
    });
    
    const response = await fetch(`${API_BASE_URL}/feed/discover?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Discover API error:', error);
    return NextResponse.json(
      { tracks: [], error: 'Failed to fetch discover tracks' },
      { status: 500 }
    );
  }
}
