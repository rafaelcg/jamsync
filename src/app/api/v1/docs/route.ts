import { NextResponse } from 'next/server';

// GET /api/v1/docs - API documentation endpoint
export async function GET() {
  const docs = {
    name: "JamSync API",
    version: "v1",
    description: "API for JamSync - Musician Collaboration Platform",
    
    endpoints: {
      auth: {
        "POST /api/v1/auth/register": {
          description: "Register a new user",
          body: {
            username: "string (required, 3-30 chars, alphanumeric + underscore)",
            email: "string (required, valid email)",
            password: "string (required, min 8 chars)",
            displayName: "string (optional)",
            avatarUrl: "string (optional)",
          },
          response: {
            user: "User object",
            accessToken: "string",
            refreshToken: "string",
          },
        },
        "POST /api/v1/auth/login": {
          description: "Login with email and password",
          body: {
            email: "string (required)",
            password: "string (required)",
          },
          response: {
            user: "User object",
            accessToken: "string",
            refreshToken: "string",
          },
        },
        "POST /api/v1/auth/logout": {
          description: "Logout user",
          response: { message: "Logged out successfully" },
        },
        "POST /api/v1/auth/refresh": {
          description: "Refresh access token",
          response: { accessToken: "string" },
        },
      },
      
      users: {
        "GET /api/v1/users/:username": {
          description: "Get user profile",
          response: {
            id: "string",
            username: "string",
            displayName: "string",
            avatarUrl: "string",
            bio: "string",
            followersCount: "number",
            followingCount: "number",
            tracksCount: "number",
            createdAt: "string",
          },
        },
        "PUT /api/v1/users/:username": {
          description: "Update user profile",
          body: {
            displayName: "string (optional)",
            bio: "string (optional)",
            avatarUrl: "string (optional)",
          },
        },
        "GET /api/v1/users/:username/followers": {
          description: "Get user followers",
        },
        "GET /api/v1/users/:username/following": {
          description: "Get users that user is following",
        },
        "POST /api/v1/users/:username/follow": {
          description: "Follow a user",
        },
        "DELETE /api/v1/users/:username/follow": {
          description: "Unfollow a user",
        },
      },
      
      tracks: {
        "GET /api/v1/tracks": {
          description: "List tracks",
          query: {
            cursor: "string (optional)",
            limit: "number (optional, default 20)",
          },
          response: {
            tracks: "Array of Track objects",
            nextCursor: "string | null",
            hasMore: "boolean",
          },
        },
        "POST /api/v1/tracks": {
          description: "Upload a new track",
          body: {
            title: "string (required)",
            description: "string (optional)",
            audioUrl: "string (required)",
            videoUrl: "string (optional)",
            durationSeconds: "number (required)",
            tags: "string[] (optional)",
          },
        },
        "GET /api/v1/tracks/:id": {
          description: "Get track details",
        },
        "DELETE /api/v1/tracks/:id": {
          description: "Delete a track",
        },
        "POST /api/v1/tracks/:id/like": {
          description: "Like a track",
        },
        "DELETE /api/v1/tracks/:id/like": {
          description: "Unlike a track",
        },
        "POST /api/v1/tracks/:id/remix": {
          description: "Create a remix of a track",
          body: {
            title: "string (required)",
            audioUrl: "string (required)",
            videoUrl: "string (optional)",
            durationSeconds: "number (required)",
          },
        },
        "POST /api/v1/tracks/:id/promote": {
          description: "Promote a remix (original track owner only)",
          body: {
            remixId: "string (required)",
          },
        },
      },
      
      feed: {
        "GET /api/v1/feed": {
          description: "Get personalized timeline feed",
          query: {
            cursor: "string (optional)",
          },
        },
        "GET /api/v1/feed/trending": {
          description: "Get trending tracks",
        },
        "GET /api/v1/feed/discover": {
          description: "Discover new tracks",
        },
        "GET /api/v1/feed/following": {
          description: "Get tracks from followed users",
        },
      },
    },
    
    types: {
      User: {
        id: "string",
        username: "string",
        displayName: "string",
        email: "string (private)",
        avatarUrl: "string",
        bio: "string",
        followersCount: "number",
        followingCount: "number",
        tracksCount: "number",
        createdAt: "ISO date string",
      },
      Track: {
        id: "string",
        userId: "string",
        user: "User object",
        title: "string",
        description: "string",
        audioUrl: "string",
        videoUrl: "string | null",
        durationSeconds: "number",
        likesCount: "number",
        commentsCount: "number",
        remixesCount: "number",
        originalTrackId: "string | null (if remix)",
        isMain: "boolean",
        createdAt: "ISO date string",
        tags: "string[]",
      },
    },
    
    authentication: {
      type: "Bearer Token",
      header: "Authorization: Bearer <accessToken>",
      refresh: "Use POST /auth/refresh to get new access token",
    },
    
    rateLimits: {
      authenticated: "100 requests/minute",
      unauthenticated: "20 requests/minute",
    },
  };
  
  return NextResponse.json(docs);
}
