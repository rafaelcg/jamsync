import { Router, Response } from 'express';
import prisma from '../config/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Optional auth middleware - doesn't fail if no token provided
const optionalAuth = (req: AuthRequest, res: Response, next: Function): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    // Token invalid, continue without auth
  }
  next();
};

router.get('/:username', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const username = req.params.username;
    const currentUserId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, displayName: true, avatarUrl: true, bio: true,
        followersCount: true, followingCount: true,
        createdAt: true,
        _count: { select: { tracks: true } },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Not Found', message: 'User not found' });
      return;
    }

    // Get follow state if user is authenticated
    let isFollowing = false;
    let isFollowedBy = false;

    if (currentUserId && currentUserId !== user.id) {
      const [isFollowingResult, isFollowedByResult] = await Promise.all([
        prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: user.id,
            },
          },
        }),
        prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: user.id,
              followingId: currentUserId,
            },
          },
        }),
      ]);
      isFollowing = !!isFollowingResult;
      isFollowedBy = !!isFollowedByResult;
    }

    const tracks = await prisma.track.findMany({
      where: { userId: user.id },
      include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json({ 
      user: { 
        ...user, 
        tracks,
        isFollowing,
        isFollowedBy,
      } 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get user' });
  }
});

// POST /users/:username/follow - Follow a user
router.post('/:username/follow', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const targetUsername = req.params.username;
    const currentUserId = req.user!.id;

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { username: targetUsername },
    });

    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (targetUser.id === currentUserId) {
      res.status(400).json({ error: 'Cannot follow yourself' });
      return;
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUser.id,
        },
      },
    });

    if (existingFollow) {
      res.status(400).json({ error: 'Already following this user' });
      return;
    }

    // Create follow
    await prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: targetUser.id,
      },
    });

    // Update counts
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { followersCount: { increment: 1 } },
    });

    await prisma.user.update({
      where: { id: currentUserId },
      data: { followingCount: { increment: 1 } },
    });

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// DELETE /users/:username/follow - Unfollow a user
router.delete('/:username/follow', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const targetUsername = req.params.username;
    const currentUserId = req.user!.id;

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { username: targetUsername },
    });

    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if follow exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUser.id,
        },
      },
    });

    if (!existingFollow) {
      res.status(404).json({ error: 'Not following this user' });
      return;
    }

    // Delete follow
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUser.id,
        },
      },
    });

    // Update counts
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { followersCount: { decrement: 1 } },
    });

    await prisma.user.update({
      where: { id: currentUserId },
      data: { followingCount: { decrement: 1 } },
    });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

export default router;
