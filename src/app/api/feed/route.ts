import { NextResponse } from 'next/server';

// GET /api/feed - Get personalized timeline
export async function GET() {
  // TODO: Replace with actual API call
  return NextResponse.json({
    tracks: [],
    nextCursor: undefined,
    hasMore: false,
  });
}
