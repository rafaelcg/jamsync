import { NextResponse } from 'next/server';

// GET /api/feed/trending - Get trending tracks
export async function GET() {
  // TODO: Replace with actual API call
  return NextResponse.json({
    tracks: [],
    nextCursor: undefined,
    hasMore: false,
  });
}
