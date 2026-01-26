/**
 * Database Seed Script for JamSync
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
        isMain: true,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[0].id,
        title: 'Midnight Drive',
        description: 'Late night driving music 🚗',
        audioUrl: 'https://example.com/audio/midnight-drive.mp3',
        durationSeconds: 210,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[1].id,
        title: 'Electric Dreams',
        description: 'Pure electronic bliss ✨',
        audioUrl: 'https://example.com/audio/electric-dreams.mp3',
        durationSeconds: 245,
        isMain: true,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[1].id,
        title: 'Club Banger 2024',
        description: 'Ready for the club? 🔥',
        audioUrl: 'https://example.com/audio/club-banger.mp3',
        durationSeconds: 195,
        isMain: true,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[2].id,
        title: 'Sunset Boulevard',
        description: 'Golden hour vibes 🌅',
        audioUrl: 'https://example.com/audio/sunset-blvd.mp3',
        durationSeconds: 220,
        isMain: true,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[2].id,
        title: 'Workout Energy',
        description: 'Get pumped! 💪',
        audioUrl: 'https://example.com/audio/workout.mp3',
        durationSeconds: 168,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[3].id,
        title: 'Soulful Morning',
        description: 'Start your day right ☕',
        audioUrl: 'https://example.com/audio/soulful.mp3',
        durationSeconds: 235,
        isMain: true,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[4].id,
        title: 'Street Stories',
        description: 'From the block to the top 🏆',
        audioUrl: 'https://example.com/audio/stories.mp3',
        durationSeconds: 190,
        isMain: true,
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
        originalTrackId: tracks[0].id,
        isMain: true,
      },
    }),
    prisma.track.create({
      data: {
        userId: users[2].id,
        title: 'Electric Dreams (Dubstep Remix)',
        description: 'Heavier version',
        audioUrl: 'https://example.com/audio/electric-dreams-dubstep.mp3',
        durationSeconds: 265,
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
        originalTrackId: tracks[3].id,
        isMain: true,
      },
    }),
  ]);

  console.log(`✅ Created ${remixes.length} remixes`);

  // Create some likes
  for (const track of [...tracks, ...remixes]) {
    for (let i = 0; i < Math.min(3, users.length); i++) {
      await prisma.like.upsert({
        where: {
          userId_trackId: {
            userId: users[i].id,
            trackId: track.id,
          },
        },
        update: {},
        create: {
          userId: users[i].id,
          trackId: track.id,
        },
      });
    }
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
