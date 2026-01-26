import { NextResponse } from 'next/server';

// GET /api/tracks - List tracks
export async function GET() {
  // TODO: Replace with actual API call
  return NextResponse.json({
    tracks: [],
    nextCursor: undefined,
    hasMore: false,
  });
}

// POST /api/tracks - Create new track
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Replace with actual API call
    return NextResponse.json({
      id: 'new-track-id',
      ...body,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
