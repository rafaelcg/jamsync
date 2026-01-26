import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Helper function to include track with user
const trackWithUserSelect = {
  id: true,
  title: true,
  description: true,
  audioUrl: true,
  coverUrl: true,
  durationSeconds: true,
  bpm: true,
  key: true,
  genre: true,
  tags: true,
  likesCount: true,
  remixesCount: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
};

// GET /feed - Personalized timeline (tracks from followed users + recommended)
router.get('/', async (req, res) => {
  try {
    // Get user from header (simulated auth for now - in production use JWT)
    const userId = req.headers['x-user-id'] as string;
    const { limit = '10', offset = '0' } = req.query;

    let tracks;

    if (userId) {
      // Get tracks from users that the current user follows
      const followedUsers = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = followedUsers.map(f => f.followingId);

      if (followingIds.length > 0) {
        // Get tracks from followed users (mixed with some recommendations)
        const followedTracks = await prisma.track.findMany({
          where: {
            userId: { in: followingIds },
            isPublic: true,
          },
          select: trackWithUserSelect,
          orderBy: { createdAt: 'desc' },
          take: parseInt(String(limit)),
          skip: parseInt(String(offset)),
        });

        // Get some recommended tracks (high engagement, not from followed users)
        const recommendedTracks = await prisma.track.findMany({
          where: {
            userId: { notIn: followingIds },
            isPublic: true,
          },
          select: trackWithUserSelect,
          orderBy: [
            { likesCount: 'desc' },
            { remixesCount: 'desc' },
          ],
          take: Math.ceil(parseInt(String(limit)) * 0.3), // 30% recommended
        });

        // Merge and shuffle for variety
        const shuffled = [...followedTracks, ...recommendedTracks]
          .sort(() => Math.random() - 0.5)
          .slice(0, parseInt(String(limit)));

        tracks = shuffled;
      } else {
        // User doesn't follow anyone, return popular tracks as recommendations
        tracks = await prisma.track.findMany({
          where: { isPublic: true },
          select: trackWithUserSelect,
          orderBy: { likesCount: 'desc' },
          take: parseInt(String(limit)),
          skip: parseInt(String(offset)),
        });
      }
    } else {
      // No user context, return trending tracks
      tracks = await prisma.track.findMany({
        where: { isPublic: true },
        select: trackWithUserSelect,
        orderBy: { likesCount: 'desc' },
        take: parseInt(String(limit)),
        skip: parseInt(String(offset)),
      });
    }

    res.json({
      tracks,
      hasMore: tracks.length === parseInt(String(limit)),
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// GET /feed/trending - Popular tracks based on likes/remixes
router.get('/trending', async (req, res) => {
  try {
    const { limit = '10', offset = '0', timeRange = 'all' } = req.query;

    // Build time filter
    const whereClause: any = { isPublic: true };
    
    if (timeRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      whereClause.createdAt = { gte: oneWeekAgo };
    } else if (timeRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      whereClause.createdAt = { gte: oneMonthAgo };
    }

    // Calculate trending score: likes * 2 + remixes * 3 (remixes are more valuable)
    const tracks = await prisma.track.findMany({
      where: whereClause,
      select: {
        ...trackWithUserSelect,
        _count: {
          select: { likes: true, remixes: true },
        },
      },
      orderBy: [
        { likesCount: 'desc' },
        { remixesCount: 'desc' },
      ],
      take: parseInt(String(limit)),
      skip: parseInt(String(offset)),
    });

    // Add trending score to response
    const tracksWithScore = tracks.map(track => ({
      ...track,
      trendingScore: track.likesCount * 2 + track.remixesCount * 3,
    }));

    res.json({
      tracks: tracksWithScore,
      hasMore: tracks.length === parseInt(String(limit)),
    });
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ error: 'Failed to fetch trending tracks' });
  }
});

// GET /feed/discover - Mix of new and diverse content
router.get('/discover', async (req, res) => {
  try {
    const { limit = '10', offset = '0', genre } = req.query;

    // Build where clause
    const whereClause: any = { isPublic: true };
    if (genre) {
      whereClause.genre = { contains: String(genre) };
    }

    // Get recent tracks (new content)
    const recentTracks = await prisma.track.findMany({
      where: whereClause,
      select: {
        ...trackWithUserSelect,
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.ceil(parseInt(String(limit)) * 0.6), // 60% recent
    });

    // Get tracks with low engagement (diverse content discovery)
    const diverseTracks = await prisma.track.findMany({
      where: {
        ...whereClause,
        likesCount: { lt: 100 }, // Less popular tracks
      },
      select: trackWithUserSelect,
      orderBy: { createdAt: 'asc' }, // Oldest first (truly diverse)
      take: Math.ceil(parseInt(String(limit)) * 0.4), // 40% diverse
    });

    // Get some random tracks from different genres (using Prisma query for SQLite compatibility)
    const randomTracks = await prisma.track.findMany({
      where: {
        ...whereClause,
      },
      select: trackWithUserSelect,
      take: Math.ceil(parseInt(String(limit)) * 0.2),
      // Note: true randomization requires database-specific functions
      // For SQLite, we'll take from different users to ensure variety
      orderBy: { userId: 'asc' },
    });

    // Merge all results
    const allTracks = [...recentTracks, ...diverseTracks, ...randomTracks]
      .filter((track, index, self) => 
        index === self.findIndex((t) => t.id === track.id)
      )
      .slice(0, parseInt(String(limit)));

    res.json({
      tracks: allTracks,
      hasMore: allTracks.length === parseInt(String(limit)),
    });
  } catch (error) {
    console.error('Get discover error:', error);
    res.status(500).json({ error: 'Failed to fetch discover tracks' });
  }
});

// GET /feed/following - Tracks only from followed users
router.get('/following', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { limit = '10', offset = '0' } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const followedUsers = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = followedUsers.map(f => f.followingId);

    const tracks = await prisma.track.findMany({
      where: {
        userId: { in: followingIds },
        isPublic: true,
      },
      select: trackWithUserSelect,
      orderBy: { createdAt: 'desc' },
      take: parseInt(String(limit)),
      skip: parseInt(String(offset)),
    });

    res.json({
      tracks,
      hasMore: tracks.length === parseInt(String(limit)),
    });
  } catch (error) {
    console.error('Get following feed error:', error);
    res.status(500).json({ error: 'Failed to fetch following feed' });
  }
});

export default router;
