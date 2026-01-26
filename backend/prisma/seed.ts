import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Realistic user profiles (22 users)
const users = [
  // Producers
  { username: 'beatmaster_pro', email: 'beatmaster@example.com', displayName: 'BeatMaster Pro', bio: 'Multi-genre producer from LA. Creating bangers since 2015.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaster' },
  { username: 'synthwave_queen', email: 'synthwave@example.com', displayName: 'SynthWave Queen', bio: 'Retro-futuristic sounds for the neon generation. 🎹🎆', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=synthqueen' },
  { username: 'trap_legend', email: 'trap@example.com', displayName: 'Trap Legend', bio: 'Hard-hitting 808s and dark melodies. 📀💀', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traplegend' },
  { username: 'lofi_dreams', email: 'lofi@example.com', displayName: 'Lofi Dreams', bio: 'Chill beats to study/chill to. ☕🎧', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lofidreams' },
  { username: 'edm_bangerz', email: 'edm@example.com', displayName: 'EDM Bangerz', bio: 'Festival-ready drops and high-energy tracks. 🎪🔥', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=edmbangerz' },
  
  // Vocalists
  { username: 'melody_voice', email: 'melody@example.com', displayName: 'Melody Voice', bio: 'Professional vocalist and songwriter. Let\'s collaborate! 🎤✨', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=melodyvoice' },
  { username: 'rhyme_slayer', email: 'rap@example.com', displayName: 'Rhyme Slayer', bio: 'Bars on bars. Freestyle champion 2023.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rhymeslayer' },
  { username: 'soul_sista', email: 'soul@example.com', displayName: 'Soul Sista', bio: 'Deep soul vocals with a modern twist. 🎶💫', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=soulsista' },
  { username: 'feat_queen', email: 'featured@example.com', displayName: 'Feature Queen', bio: 'I sing on your tracks! Open for collaborations. 👑🎵', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=featqueen' },
  { username: 'harmony_hunter', email: 'harmony@example.com', displayName: 'Harmony Hunter', bio: 'Finding the perfect vocal harmony for your tracks.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=harmonyhunter' },
  
  // Instrumentalists
  { username: 'guitar_hero', email: 'guitar@example.com', displayName: 'Guitar Hero', bio: 'Shredding solos and smooth riffs. electric & acoustic. 🎸🔥', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guitarhero' },
  { username: 'keys_master', email: 'keys@example.com', displayName: 'Keys Master', bio: 'Piano, synth, and everything in between. 20 years exp.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=keysmaster' },
  { username: 'bass_god', email: 'bass@example.com', displayName: 'Bass God', bio: 'Low frequencies only. Sub-bass specialist. 🎸🔊', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bassgod' },
  { username: 'drum_king', email: 'drums@example.com', displayName: 'Drum King', bio: 'Live drums, programmed beats, and everything percussion. 🥁👑', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=drumking' },
  { username: 'violin_virtuoso', email: 'violin@example.com', displayName: 'Violin Virtuoso', bio: 'Classical training, modern sound. String arrangements. 🎻', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=violinvirtuoso' },
  
  // More diverse users
  { username: 'jazz_cat', email: 'jazz@example.com', displayName: 'Jazz Cat', bio: 'Smooth jazz and improvisations. 🎷☕', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jazzcat' },
  { username: 'reggae_vibes', email: 'reggae@example.com', displayName: 'Reggae Vibes', bio: 'One love, one heart, one destiny. 🌴🎶', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reggaevibes' },
  { username: 'hiphop_beats', email: 'hiphop@example.com', displayName: 'HipHop Beats', bio: 'Classic and modern hip hop production. 🎤🎚️', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hiphopbeats' },
  { username: 'rock_legend', email: 'rock@example.com', displayName: 'Rock Legend', bio: 'Guitar-driven rock anthems. 🤘🎸', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rocklegend' },
  { username: 'ambient_waves', email: 'ambient@example.com', displayName: 'Ambient Waves', bio: 'Atmospheric soundscapes for meditation and focus. 🧘🎧', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ambientwaves' },
  { username: 'house_hearts', email: 'house@example.com', displayName: 'House Hearts', bio: 'Deep house and garage vibes. 🏠💜', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=househearts' },
];

// Sample audio URLs that work (using SoundHelix for demo purposes)
const sampleAudioUrls = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
];

function getRandomAudioUrl(): string {
  return sampleAudioUrls[Math.floor(Math.random() * sampleAudioUrls.length)];
}

function getRandomCoverUrl(seed: string): string {
  return `https://picsum.photos/seed/${seed}/500/500`;
}

// Original tracks (52 tracks)
const tracks = [
  // BeatMaster Pro tracks (userIndex: 0)
  { userIndex: 0, title: 'Midnight Drive', description: 'Driving synthwave vibes for late night cruises', genre: 'Synthwave', tags: 'synthwave,retro,neon,chill', durationSeconds: 215, bpm: 110, key: 'Am' },
  { userIndex: 0, title: 'Summer Breeze', description: 'Upbeat tropical house for beach days', genre: 'House', tags: 'tropical,summer,beach,chill', durationSeconds: 185, bpm: 124, key: 'G' },
  { userIndex: 0, title: 'Dark Matter', description: 'Deep bass and atmospheric textures', genre: 'Trap', tags: 'dark,bass,atmospheric,space', durationSeconds: 200, bpm: 140, key: 'Cm' },
  
  // Synthwave Queen tracks (userIndex: 1)
  { userIndex: 1, title: 'Neon Dreams', description: 'Retro synth melodies with modern production', genre: 'Synthwave', tags: 'neon,retro,80s,vaporwave', durationSeconds: 240, bpm: 118, key: 'Em' },
  { userIndex: 1, title: 'Cyber City', description: 'Futuristic urban soundscape', genre: 'Synthwave', tags: 'cyber,urban,future,electronic', durationSeconds: 195, bpm: 128, key: 'Dm' },
  { userIndex: 1, title: 'Electric Heart', description: 'High energy synth anthem', genre: 'Synthwave', tags: 'electric,energy,anthem,dance', durationSeconds: 220, bpm: 130, key: 'F' },
  
  // Trap Legend tracks (userIndex: 2)
  { userIndex: 2, title: 'Demon Dance', description: 'Hard-hitting 808s and dark melodies', genre: 'Trap', tags: 'trap,hard,dark,aggressive', durationSeconds: 175, bpm: 150, key: 'Gm' },
  { userIndex: 2, title: 'Night Stalker', description: 'Eerie vibes for late night sessions', genre: 'Trap', tags: 'night,eerie,spooky,dark', durationSeconds: 190, bpm: 145, key: 'Bm' },
  
  // Lofi Dreams tracks (userIndex: 3)
  { userIndex: 3, title: 'Coffee Shop Vibes', description: 'Perfect for studying or relaxing', genre: 'Lofi', tags: 'lofi,chill,study,relax', durationSeconds: 180, bpm: 85, key: 'Cmaj7' },
  { userIndex: 3, title: 'Rainy Day', description: 'Melancholic lofi for rainy afternoons', genre: 'Lofi', tags: 'rain,melancholy,chill,moody', durationSeconds: 200, bpm: 80, key: 'Am7' },
  { userIndex: 3, title: 'Midnight Study', description: 'Late night study sessions', genre: 'Lofi', tags: 'study,night,focus,chill', durationSeconds: 165, bpm: 82, key: 'Fmaj7' },
  
  // EDM Bangerz tracks (userIndex: 4)
  { userIndex: 4, title: 'Festival Drop', description: 'Mainstage festival anthem', genre: 'EDM', tags: 'festival,bigroom,drop,energy', durationSeconds: 210, bpm: 128, key: 'C' },
  { userIndex: 4, title: 'Future Bass Dreams', description: 'Wobbly leads and emotional chords', genre: 'EDM', tags: 'futurebass,wobble,emotional,melodic', durationSeconds: 235, bpm: 150, key: 'G' },
  
  // Melody Voice tracks (userIndex: 5)
  { userIndex: 5, title: 'Echoes', description: 'Vocals with ethereal production', genre: 'Pop', tags: 'pop,vocal,ethereal,dreamy', durationSeconds: 195, bpm: 100, key: 'Em' },
  { userIndex: 5, title: 'Rise Up', description: 'Empowering anthem with powerful vocals', genre: 'Pop', tags: 'empowering,anthem,strong,vocal', durationSeconds: 220, bpm: 120, key: 'Am' },
  
  // Rhyme Slayer tracks (userIndex: 6)
  { userIndex: 6, title: 'Bars On Fire', description: 'Hard-hitting rap verses', genre: 'Hip Hop', tags: 'hiphop,rap,bars,hard', durationSeconds: 160, bpm: 92, key: 'Cm' },
  { userIndex: 6, title: 'Freestyle Session', description: 'Off the dome flows', genre: 'Hip Hop', tags: 'freestyle,rap,flow,cypher', durationSeconds: 175, bpm: 95, key: 'Dm' },
  
  // Soul Sista tracks (userIndex: 7)
  { userIndex: 7, title: 'Soulful Morning', description: 'Smooth soul for relaxed mornings', genre: 'R&B', tags: 'soul,rnb,smooth,morning', durationSeconds: 205, bpm: 85, key: 'G' },
  { userIndex: 7, title: 'Deep Love', description: 'Love ballad with soulful vocals', genre: 'R&B', tags: 'love,ballad,soul,romantic', durationSeconds: 240, bpm: 72, key: 'Am' },
  
  // Feature Queen tracks (userIndex: 8)
  { userIndex: 8, title: 'Collab Dreams', description: 'Looking for producers to collaborate!', genre: 'Pop', tags: 'collab,vocal,pop,feature', durationSeconds: 185, bpm: 110, key: 'C' },
  
  // Harmony Hunter tracks (userIndex: 9)
  { userIndex: 9, title: 'Vocal Layers', description: 'Experimenting with vocal harmonies', genre: 'A Cappella', tags: 'vocal,harmony,a cappella,layers', durationSeconds: 150, bpm: 100, key: 'G' },
  
  // Guitar Hero tracks (userIndex: 10)
  { userIndex: 10, title: 'Shredding Solo', description: 'Fast-paced guitar instrumental', genre: 'Rock', tags: 'guitar,solo,rock,shred', durationSeconds: 185, bpm: 160, key: 'E' },
  { userIndex: 10, title: 'Acoustic Sunset', description: 'Peaceful acoustic guitar piece', genre: 'Acoustic', tags: 'acoustic,chill,relax,guitar', durationSeconds: 210, bpm: 95, key: 'G' },
  
  // Keys Master tracks (userIndex: 11)
  { userIndex: 11, title: 'Jazz Piano', description: 'Smooth jazz piano improvisation', genre: 'Jazz', tags: 'jazz,piano,smooth,instrumental', durationSeconds: 250, bpm: 90, key: 'Dm' },
  { userIndex: 11, title: 'Electric Dreams', description: 'Retro synth piano vibes', genre: 'Electronic', tags: 'synth,piano,retro,electronic', durationSeconds: 225, bpm: 110, key: 'Em' },
  
  // Bass God tracks (userIndex: 12)
  { userIndex: 12, title: 'Subwoofer Test', description: 'Deep sub bass for testing systems', genre: 'Electronic', tags: 'bass,sub,deep,test', durationSeconds: 150, bpm: 80, key: 'Am' },
  { userIndex: 12, title: 'Dub Weight', description: 'Heavy dub bass lines', genre: 'Dubstep', tags: 'dubstep,bass,heavy,dub', durationSeconds: 190, bpm: 140, key: 'Cm' },
  
  // Drum King tracks (userIndex: 13)
  { userIndex: 13, title: 'Live Drum Session', description: 'Organic live drum performance', genre: 'World', tags: 'drums,live,organic,percussion', durationSeconds: 180, bpm: 120, key: 'Dm' },
  { userIndex: 13, title: 'Breakbeat Madness', description: 'Complex breakbeat rhythms', genre: 'Breakbeat', tags: 'breakbeat,drums,complex,rhythm', durationSeconds: 195, bpm: 135, key: 'G' },
  
  // Violin Virtuoso tracks (userIndex: 14)
  { userIndex: 14, title: 'Classical Fusion', description: 'Classical violin with modern production', genre: 'Classical', tags: 'violin,classical,fusion,strings', durationSeconds: 270, bpm: 70, key: 'Am' },
  { userIndex: 14, title: 'Epic Orchestra', description: 'Cinematic orchestral strings', genre: 'Cinematic', tags: 'orchestral,cinematic,epic,strings', durationSeconds: 300, bpm: 80, key: 'Cm' },
  
  // Jazz Cat tracks (userIndex: 15)
  { userIndex: 15, title: 'Smooth Jazz', description: 'Jazz for relaxation', genre: 'Jazz', tags: 'jazz,smooth,relax,instrumental', durationSeconds: 240, bpm: 75, key: 'Fmaj7' },
  { userIndex: 15, title: 'Improvisation', description: 'Spontaneous jazz improvisation', genre: 'Jazz', tags: 'jazz,improv,free,instrumental', durationSeconds: 280, bpm: 120, key: 'Dm' },
  
  // Reggae Vibes tracks (userIndex: 16)
  { userIndex: 16, title: 'Island Time', description: 'Classic reggae vibes', genre: 'Reggae', tags: 'reggae,island,chill,roots', durationSeconds: 210, bpm: 75, key: 'G' },
  { userIndex: 16, title: 'Dub Journey', description: 'Deep dub experience', genre: 'Reggae', tags: 'dub,reggae,deep,roots', durationSeconds: 235, bpm: 70, key: 'Am' },
  
  // HipHop Beats tracks (userIndex: 17)
  { userIndex: 17, title: 'Classic Boom Bap', description: 'Old school hip hop vibes', genre: 'Hip Hop', tags: 'hiphop,boombap,classic,oldschool', durationSeconds: 185, bpm: 90, key: 'Cm' },
  { userIndex: 17, title: 'Modern Trap Beat', description: 'Contemporary trap production', genre: 'Hip Hop', tags: 'trap,modern,hiphop,current', durationSeconds: 170, bpm: 144, key: 'Gm' },
  
  // Rock Legend tracks (userIndex: 18)
  { userIndex: 18, title: 'Electric Guitar Riff', description: 'High energy rock guitar', genre: 'Rock', tags: 'rock,guitar,riff,electric', durationSeconds: 195, bpm: 140, key: 'E' },
  { userIndex: 18, title: 'Power Ballad', description: 'Epic rock power ballad', genre: 'Rock', tags: 'rock,ballad,power,epic', durationSeconds: 280, bpm: 85, key: 'Am' },
  
  // Ambient Waves tracks (userIndex: 19)
  { userIndex: 19, title: 'Space Ambient', description: 'Deep space ambient soundscapes', genre: 'Ambient', tags: 'ambient,space,meditation,calm', durationSeconds: 300, bpm: 60, key: 'Am' },
  { userIndex: 19, title: 'Forest Rain', description: 'Nature sounds with ambient textures', genre: 'Ambient', tags: 'ambient,nature,rain,relax', durationSeconds: 330, bpm: 65, key: 'Em' },
  
  // House Hearts tracks (userIndex: 20)
  { userIndex: 20, title: 'Deep House Vibes', description: 'Deep house for late nights', genre: 'House', tags: 'deephouse,chill,dance,club', durationSeconds: 240, bpm: 122, key: 'Fm' },
  { userIndex: 20, title: 'Garage Groove', description: 'UK garage inspired beat', genre: 'House', tags: 'garage,uk,groove,rhythm', durationSeconds: 200, bpm: 130, key: 'Gm' },
];

// Remixes (17 tracks)
const remixes = [
  { originalTrackIndex: 0, userIndex: 1, title: 'Midnight Drive - Synthwave Remix', description: 'Retro synth makeover', genre: 'Synthwave', tags: 'remix,synthwave,retro', durationSeconds: 230, bpm: 115, key: 'Am' },
  { originalTrackIndex: 0, userIndex: 3, title: 'Midnight Drive - Lofi Remix', description: 'Chill lofi version', genre: 'Lofi', tags: 'remix,lofi,chill', durationSeconds: 200, bpm: 82, key: 'Am' },
  { originalTrackIndex: 3, userIndex: 0, title: 'Neon Dreams - Deep House Remix', description: 'Dance floor version', genre: 'House', tags: 'remix,house,deep', durationSeconds: 260, bpm: 124, key: 'Em' },
  { originalTrackIndex: 1, userIndex: 4, title: 'Summer Breeze - EDM Remix', description: 'Festival-ready version', genre: 'EDM', tags: 'remix,edm,festival', durationSeconds: 210, bpm: 128, key: 'G' },
  { originalTrackIndex: 2, userIndex: 4, title: 'Dark Matter - Festival Trap Remix', description: 'Mainstage version', genre: 'Trap', tags: 'remix,trap,festival', durationSeconds: 195, bpm: 150, key: 'Cm' },
  { originalTrackIndex: 8, userIndex: 3, title: 'Coffee Shop Vibes - Extended Mix', description: 'Longer chill version', genre: 'Lofi', tags: 'remix,lofi,extended', durationSeconds: 240, bpm: 85, key: 'Cmaj7' },
  { originalTrackIndex: 9, userIndex: 10, title: 'Rainy Day - Acoustic Version', description: 'Stripped down version', genre: 'Acoustic', tags: 'remix,acoustic,stripped', durationSeconds: 220, bpm: 75, key: 'Am7' },
  { originalTrackIndex: 11, userIndex: 5, title: 'Rise Up - Orchestral Version', description: 'Full orchestra treatment', genre: 'Cinematic', tags: 'remix,orchestral,epic', durationSeconds: 280, bpm: 120, key: 'Am' },
  { originalTrackIndex: 12, userIndex: 0, title: 'Festival Drop - VIP Mix', description: 'Updated version with new drop', genre: 'EDM', tags: 'remix,edm,vip', durationSeconds: 225, bpm: 130, key: 'C' },
  { originalTrackIndex: 14, userIndex: 7, title: 'Bars On Fire - Soulful Remix', description: 'Smooth soul version', genre: 'R&B', tags: 'remix,soul,rnb', durationSeconds: 190, bpm: 88, key: 'Cm' },
  { originalTrackIndex: 18, userIndex: 8, title: 'Soulful Morning - Vocal Version', description: 'Added vocals', genre: 'R&B', tags: 'remix,vocal,rnb', durationSeconds: 220, bpm: 85, key: 'G' },
  { originalTrackIndex: 21, userIndex: 11, title: 'Electric Dreams - Piano Version', description: 'Piano solo version', genre: 'Acoustic', tags: 'remix,piano,acoustic', durationSeconds: 240, bpm: 105, key: 'Em' },
  { originalTrackIndex: 22, userIndex: 12, title: 'Subwoofer Test - Dubstep Remix', description: 'Heavy dubstep version', genre: 'Dubstep', tags: 'remix,dubstep,bass', durationSeconds: 175, bpm: 140, key: 'Am' },
  { originalTrackIndex: 25, userIndex: 14, title: 'Epic Orchestra - Violin Solo', description: 'Violin extract', genre: 'Classical', tags: 'remix,classical,violin', durationSeconds: 180, bpm: 70, key: 'Cm' },
  { originalTrackIndex: 26, userIndex: 12, title: 'Smooth Jazz - Bass Heavy', description: 'Enhanced bass', genre: 'Jazz', tags: 'remix,jazz,bass', durationSeconds: 260, bpm: 78, key: 'Fmaj7' },
  { originalTrackIndex: 29, userIndex: 17, title: 'Classic Boom Bap - Trap Remix', description: 'Modern take', genre: 'Hip Hop', tags: 'remix,trap,hiphop', durationSeconds: 175, bpm: 140, key: 'Cm' },
  { originalTrackIndex: 31, userIndex: 19, title: 'Space Ambient - Extended', description: 'Extended meditation', genre: 'Ambient', tags: 'remix,ambient,extended', durationSeconds: 420, bpm: 60, key: 'Am' },
];

// Follow relationships
const followRelationships = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 0], [1, 3], [1, 4], [1, 11],
  [2, 0], [2, 3], [2, 6], [2, 12],
  [3, 0], [3, 1], [3, 8], [3, 19],
  [4, 0], [4, 1], [4, 5], [4, 20],
  [5, 0], [5, 7], [5, 8], [5, 9],
  [6, 2], [6, 17], [6, 18],
  [7, 5], [7, 9], [7, 15],
  [8, 5], [8, 7], [8, 10],
  [9, 5], [9, 7], [9, 8],
  [10, 8], [10, 11], [10, 18],
  [11, 10], [11, 14], [11, 15],
  [12, 2], [12, 13], [12, 20],
  [13, 12], [13, 17], [13, 18],
  [14, 11], [14, 15], [14, 18],
  [15, 7], [15, 11], [15, 14],
  [16, 3], [16, 20],
  [17, 6], [17, 13], [17, 18],
  [18, 10], [18, 13], [18, 14],
  [19, 3], [19, 16], [19, 20],
  [20, 4], [20, 12], [20, 19],
];

// Like relationships (userIndex -> trackIndices)
const likeRelationships: { userIndex: number; trackIndices: number[] }[] = [
  { userIndex: 0, trackIndices: [3, 5, 8, 12, 20, 25, 30] },
  { userIndex: 1, trackIndices: [0, 2, 8, 10, 15, 22, 35] },
  { userIndex: 2, trackIndices: [0, 6, 7, 14, 16, 32] },
  { userIndex: 3, trackIndices: [0, 1, 8, 9, 10, 20, 38] },
  { userIndex: 4, trackIndices: [1, 3, 11, 12, 40, 45] },
  { userIndex: 5, trackIndices: [3, 5, 18, 19, 25, 30] },
  { userIndex: 6, trackIndices: [14, 16, 29, 32, 50] },
  { userIndex: 7, trackIndices: [5, 18, 19, 25, 26] },
  { userIndex: 8, trackIndices: [5, 11, 18, 19, 30] },
  { userIndex: 9, trackIndices: [5, 9, 18, 25, 27] },
  { userIndex: 10, trackIndices: [0, 3, 20, 21, 35, 40] },
  { userIndex: 11, trackIndices: [21, 22, 26, 27, 40] },
  { userIndex: 12, trackIndices: [2, 6, 7, 22, 32] },
  { userIndex: 13, trackIndices: [12, 29, 30, 32] },
  { userIndex: 14, trackIndices: [25, 26, 35, 40, 45] },
  { userIndex: 15, trackIndices: [18, 19, 26, 27, 40] },
  { userIndex: 16, trackIndices: [8, 9, 10, 38, 39] },
  { userIndex: 17, trackIndices: [14, 16, 29, 30, 32] },
  { userIndex: 18, trackIndices: [20, 21, 29, 30, 35] },
  { userIndex: 19, trackIndices: [38, 39, 40, 41, 52] },
  { userIndex: 20, trackIndices: [1, 12, 40, 45, 50] },
];

async function main() {
  console.log('🌱 Starting JamSync database seed...\n');

  // Create password hash
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create users
  console.log('👤 Creating users...');
  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: passwordHash,
      },
    });
    createdUsers.push(user);
    console.log(`  ✓ Created user: ${user.displayName} (@${user.username})`);
  }
  console.log(`\n✅ Created ${createdUsers.length} users\n`);

  // Create original tracks
  console.log('🎵 Creating original tracks...');
  const createdTracks = [];
  for (const trackData of tracks) {
    const track = await prisma.track.create({
      data: {
        userId: createdUsers[trackData.userIndex].id,
        title: trackData.title,
        description: trackData.description,
        audioUrl: getRandomAudioUrl(),
        coverUrl: getRandomCoverUrl(trackData.title.replace(/\s+/g, '').toLowerCase()),
        durationSeconds: trackData.durationSeconds,
        bpm: trackData.bpm,
        key: trackData.key,
        genre: trackData.genre,
        tags: trackData.tags,
        isPublic: true,
        isMain: true,
        processingStatus: 'completed',
        waveformData: JSON.stringify({ peaks: Array.from({ length: 100 }, () => Math.random()) }),
        waveformPeaks: JSON.stringify(Array.from({ length: 50 }, () => Math.random() * 100)),
      },
    });
    createdTracks.push(track);
    console.log(`  ✓ Created track: "${track.title}" by @${createdUsers[trackData.userIndex].username}`);
  }
  console.log(`\n✅ Created ${createdTracks.length} original tracks\n`);

  // Create remixes
  console.log('🔄 Creating remixes...');
  for (const remixData of remixes) {
    const originalTrack = createdTracks[remixData.originalTrackIndex];
    const remix = await prisma.track.create({
      data: {
        userId: createdUsers[remixData.userIndex].id,
        title: remixData.title,
        description: remixData.description,
        audioUrl: getRandomAudioUrl(),
        coverUrl: getRandomCoverUrl(remixData.title.replace(/\s+/g, '').toLowerCase()),
        durationSeconds: remixData.durationSeconds,
        bpm: remixData.bpm,
        key: remixData.key,
        genre: remixData.genre,
        tags: remixData.tags,
        isPublic: true,
        isMain: false,
        processingStatus: 'completed',
        originalTrackId: originalTrack.id,
        originalAuthorId: originalTrack.userId,
        waveformData: JSON.stringify({ peaks: Array.from({ length: 100 }, () => Math.random()) }),
        waveformPeaks: JSON.stringify(Array.from({ length: 50 }, () => Math.random() * 100)),
      },
    });
    createdTracks.push(remix);
    console.log(`  ✓ Created remix: "${remix.title}" of "${originalTrack.title}"`);
    
    // Update original track remix count
    await prisma.track.update({
      where: { id: originalTrack.id },
      data: { remixesCount: { increment: 1 } },
    });
  }
  console.log(`\n✅ Created ${remixes.length} remixes\n`);

  // Create follows
  console.log('👥 Creating follow relationships...');
  let followCount = 0;
  for (const [followerIndex, followingIndex] of followRelationships) {
    try {
      await prisma.follow.create({
        data: {
          followerId: createdUsers[followerIndex].id,
          followingId: createdUsers[followingIndex].id,
        },
      });
      followCount++;
    } catch (e) {
      // Ignore duplicate follows
    }
  }
  console.log(`  ✓ Created ${followCount} follow relationships\n`);

  // Update follower/following counts
  console.log('📊 Updating follower/following counts...');
  for (const user of createdUsers) {
    const followerCount = await prisma.follow.count({
      where: { followingId: user.id },
    });
    const followingCount = await prisma.follow.count({
      where: { followerId: user.id },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        followersCount: followerCount,
        followingCount: followingCount,
      },
    });
  }
  console.log('  ✓ Updated counts\n');

  // Create likes
  console.log('❤️ Creating likes...');
  let likeCount = 0;
  for (const { userIndex, trackIndices } of likeRelationships) {
    for (const trackIndex of trackIndices) {
      if (trackIndex < createdTracks.length) {
        try {
          await prisma.like.create({
            data: {
              userId: createdUsers[userIndex].id,
              trackId: createdTracks[trackIndex].id,
            },
          });
          likeCount++;
          
          // Update track like count
          await prisma.track.update({
            where: { id: createdTracks[trackIndex].id },
            data: { likesCount: { increment: 1 } },
          });
        } catch (e) {
          // Ignore duplicate likes
        }
      }
    }
  }
  console.log(`  ✓ Created ${likeCount} likes\n`);

  // Summary
  const userCount = await prisma.user.count();
  const trackCount = await prisma.track.count();
  const remixCount = await prisma.track.count({ where: { originalTrackId: { not: null } } });
  const likeCountTotal = await prisma.like.count();
  const followCountTotal = await prisma.follow.count();

  console.log('='.repeat(50));
  console.log('🎉 JamSync Database Seed Complete!');
  console.log('='.repeat(50));
  console.log(`📊 Database Summary:`);
  console.log(`   👤 Users: ${userCount}`);
  console.log(`   🎵 Tracks: ${trackCount}`);
  console.log(`   🔄 Remixes: ${remixCount}`);
  console.log(`   ❤️ Likes: ${likeCountTotal}`);
  console.log(`   👥 Follows: ${followCountTotal}`);
  console.log('='.repeat(50));
  console.log('\n🔑 Test Credentials:');
  console.log('   Email: beatmaster@example.com');
  console.log('   Password: password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });