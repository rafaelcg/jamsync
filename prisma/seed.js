/**
 * Database Seed Script for JamSync
 * Run with: npx prisma db seed
 * or: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: 'beatmaker' },
      update: {},
      create: {
        username: 'beatmaker',
        email: 'beatmaker@example.com',
        displayName: 'Beat Maker',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaker',
        bio: 'Producer from LA 🎵\nCreating vibes since 2020',
        followersCount: 12500,
        followingCount: 342,
      },
    }),
    prisma.user.upsert({
      where: { username: 'producer_x' },
      update: {},
      create: {
        username: 'producer_x',
        email: 'producer@example.com',
        displayName: 'Producer X',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=producer',
        bio: 'Electronic music producer\nFuture house specialist',
        followersCount: 25000,
        followingCount: 189,
      },
    }),
    prisma.user.upsert({
      where: { username: 'dj_master' },
      update: {},
      create: {
        username: 'dj_master',
        email: 'djmaster@example.com',
        displayName: 'DJ Master',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=djmaster',
        bio: 'DJ & Producer\nSpinning tracks since 2015',
        followersCount: 45000,
        followingCount: 89,
      },
    }),
    prisma.user.upsert({
      where: { username: 'singer_sara' },
      update: {},
      create: {
        username: 'singer_sara',
        email: 'sara@example.com',
        displayName: 'Sara Singer',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
        bio: 'Vocalist & Songwriter\nR&B | Pop | Soul',
        followersCount: 18900,
        followingCount: 456,
      },
    }),
    prisma.user.upsert({
      where: { username: 'rapper_roy' },
      update: {},
      create: {
        username: 'rapper_roy',
        email: 'roy@example.com',
        displayName: 'Roy The Rapper',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=roy',
        bio: 'Hip Hop Artist\nWord to your mother',
        followersCount: 32000,
        followingCount: 234,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample tracks
  const tracks = await Promise.all([
    prisma.track.create({
      data: {
        userId: users[0].id,
        title: 'Summer Vibes',
        description: 'Just vibing on this summer track ☀️',
        audioUrl: 'https://example.com/audio/summer-vibes.mp3',
        durationSeconds: 185,
        likesCount: 2500,
        commentsCount: 156,
        remixesCount: 8,
        isMain: true,
        tags: ['summer', 'chill', 'beats'],
      },
    }),
    prisma.track.create({
      data: {
        userId: users[0].id,
        title: 'Midnight Drive',
        description: 'Late night driving music 🚗',
        audioUrl: 'https://example.com/audio/midnight-drive.mp3',
        durationSeconds: 210,
        likesCount: 3400,
        commentsCount: 234,
        remixesCount: 12,
        tags: ['night', 'driving', 'electronic'],
      },
    }),
    prisma.track.create({
      data: {
        userId: users[1].id,
        title: 'Electric Dreams',
        description: 'Pure electronic bliss ✨',
        audioUrl: 'https://example.com/audio/electric-dreams.mp3',
        durationSeconds: 245,
        likesCount: 5600,
        commentsCount: 345,
        remixesCount: 25,
        isMain: true,
        tags: ['electronic', 'edm', 'synth'],
      },
    }),
    prisma.track.create({
      data: {
        userId: users[1].id,
        title: 'Club Banger 2024',
        description: 'Ready for the club? 🔥',
        audioUrl: 'https://example.com/audio/club-banger.mp3',
        durationSeconds: 195,
        likesCount: 8200,
        commentsCount: 567,
        remixesCount: 45,
        tags: ['club', 'dance', 'edm'],
      },
    }),
    prisma.track.create({
      data: {
        userId: users[2].id,
        title: 'Sunset Boulevard',
        description: 'Golden hour vibes 🌅',
        audioUrl: 'https://example.com/audio/sunset-blvd.mp3',
        durationSeconds: 220,
        likesCount: 4100,
        commentsCount: 289,
        remixesCount: 18,
        isMain: true,
        tags: ['chill', 'sunset', 'lofi'],
      },
    }),
    prisma.track.create({
      data: {
        userId: users[2].id,
        title: 'Workout Energy',
        description: 'Get pumped! 💪',
        audioUrl: 'https://example.com/audio/workout.mp3',
        durationSeconds: 168,
        likesCount: 2900,
        commentsCount: 145,
        remixesCount: 9,
        tags: ['workout', 'energetic', 'hiphop'],
      },
    }),
    prisma.track.create({
      data: {
        userId: users[3].id,
        title: 'Soulful Morning',
        description: 'Start your day right ☕',
        audioUrl: 'https://example.com/audio/soulful.mp3',
        durationSeconds: 235,
        likesCount: 5100,
        commentsCount: 398,
        remixesCount: 22,
        isMain: true,
        tags: ['soul', 'rnb', 'morning'],
      },
    }),
    prisma.track.create({
      data: {
        userId: users[4].id,
        title: 'Street Stories',
        description: 'From the block to the top 🏆',
        audioUrl: 'https://example.com/audio/stories.mp3',
        durationSeconds: 190,
        likesCount: 9500,
        commentsCount: 678,
        remixesCount: 56,
        isMain: true,
        tags: ['hiphop', 'rap', 'street'],
      },
    }),
  ]);

  console.log(`✅ Created ${tracks.length} tracks`);

  // Create some remixes
  const remixes = await Promise.all([
    prisma.track.create({
      data: {
        userId: users[1].id,
        title: 'Summer Vibes (Club Remix)',
        description: 'My take on the classic',
        audioUrl: 'https://example.com/audio/summer-vibes-remix.mp3',
        durationSeconds: 210,
        likesCount: 890,
        commentsCount: 67,
        originalTrackId: tracks[0].id,
        isMain: true,
        mainTrackId: tracks[0].id,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[2].id,
        title: 'Electric Dreams (Dubstep Remix)',
        description: 'Heavier version',
        audioUrl: 'https://example.com/audio/electric-dreams-dubstep.mp3',
        durationSeconds: 265,
        likesCount: 1200,
        commentsCount: 89,
        originalTrackId: tracks[2].id,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[3].id,
        title: 'Club Banger (Acoustic)',
        description: 'Stripped down version',
        audioUrl: 'https://example.com/audio/club-banger-acoustic.mp3',
        durationSeconds: 180,
        likesCount: 650,
        commentsCount: 45,
        originalTrackId: tracks[3].id,
        isMain: true,
        mainTrackId: tracks[3].id,
      },
    }),
  ]);

  console.log(`✅ Created ${remixes.length} remixes`);

  // Create likes
  const likesData = [];
  for (const track of tracks) {
    for (const user of users.slice(0, 3)) {
      likesData.push({
        userId: user.id,
        trackId: track.id,
      });
    }
  }
  
  for (const remix of remixes) {
    for (const user of users) {
      likesData.push({
        userId: user.id,
        trackId: remix.id,
      });
    }
  }

  // Use upsert to handle duplicates
  for (const like of likesData) {
    await prisma.like.upsert({
      where: {
        userId_trackId: like,
      },
      update: {},
      create: like,
    });
  }

  console.log(`✅ Created likes`);

  // Create follows
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users.length; j++) {
      if (i !== j && Math.random() > 0.5) {
        await prisma.follow.upsert({
          where: {
            followerId_followingId: {
              followerId: users[i].id,
              followingId: users[j].id,
            },
          },
          update: {},
          create: {
            followerId: users[i].id,
            followingId: users[j].id,
          },
        });
      }
    }
  }

  console.log(`✅ Created follows`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
