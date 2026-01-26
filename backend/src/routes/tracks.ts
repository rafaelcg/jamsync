import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /tracks
router.get('/', async (req, res) => {
  try {
    const { limit = '50', offset = '0', genre, userId } = req.query;

    const where: any = {
      isPublic: true,
    };
    if (genre) where.genre = String(genre);
    if (userId) where.userId = String(userId);

    const tracks = await prisma.track.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(String(limit)),
      skip: parseInt(String(offset)),
    });

    // Parse waveformPeaks for each track
    const tracksWithWaveform = tracks.map(track => ({
      ...track,
      waveformPeaks: track.waveformPeaks ? JSON.parse(track.waveformPeaks) : null,
    }));

    const total = await prisma.track.count({ where });

    res.json({
      tracks: tracksWithWaveform,
      pagination: {
        total,
        limit: parseInt(String(limit)),
        offset: parseInt(String(offset)),
      },
    });
  } catch (error) {
    console.error('Get tracks error:', error);
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

// POST /tracks (protected)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = req.body;

    const track = await prisma.track.create({
      data: {
        title: data.title,
        description: data.description,
        audioUrl: data.audioUrl,
        coverUrl: data.coverUrl,
        durationSeconds: data.durationSeconds,
        bpm: data.bpm,
        key: data.key,
        genre: data.genre,
        tags: data.tags,
        isPublic: data.isPublic ?? true,
        userId: req.user!.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    res.status(201).json(track);
  } catch (error) {
    console.error('Create track error:', error);
    res.status(500).json({ error: 'Failed to create track' });
  }
});

// GET /tracks/:id
router.get('/:id', async (req, res) => {
  try {
    const track = await prisma.track.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        originalTrack: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
        remixes: {
          where: { isPublic: true },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
        _count: {
          select: { likes: true, remixes: true },
        },
      },
    });

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Parse JSON fields
    const trackWithParsedData = {
      ...track,
      waveformData: track.waveformData ? JSON.parse(track.waveformData) : null,
      waveformPeaks: track.waveformPeaks ? JSON.parse(track.waveformPeaks) : null,
    };

    res.json(trackWithParsedData);
  } catch (error) {
    console.error('Get track error:', error);
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

// POST /tracks/:id/like - Like a track
router.post('/:id/like', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const trackId = req.params.id;
    const userId = req.user!.id;

    // Check if track exists
    const track = await prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_trackId: {
          userId,
          trackId,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({ error: 'Track already liked' });
    }

    // Create like
    await prisma.like.create({
      data: {
        userId,
        trackId,
      },
    });

    // Increment likes count
    await prisma.track.update({
      where: { id: trackId },
      data: { likesCount: { increment: 1 } },
    });

    res.json({ message: 'Track liked successfully' });
  } catch (error) {
    console.error('Like track error:', error);
    res.status(500).json({ error: 'Failed to like track' });
  }
});

// DELETE /tracks/:id/like - Unlike a track
router.delete('/:id/like', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const trackId = req.params.id;
    const userId = req.user!.id;

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_trackId: {
          userId,
          trackId,
        },
      },
    });

    if (!existingLike) {
      return res.status(404).json({ error: 'Like not found' });
    }

    // Delete like
    await prisma.like.delete({
      where: {
        userId_trackId: {
          userId,
          trackId,
        },
      },
    });

    // Decrement likes count
    await prisma.track.update({
      where: { id: trackId },
      data: { likesCount: { decrement: 1 } },
    });

    res.json({ message: 'Track unliked successfully' });
  } catch (error) {
    console.error('Unlike track error:', error);
    res.status(500).json({ error: 'Failed to unlike track' });
  }
});

export default router;
