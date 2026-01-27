"use client";

import React, { useState, useEffect } from "react";
import { TopBar } from "@/components/layout";
import { FeaturedRemixes, TrendingTracks } from "@/components/feed";
import { TrackCard } from "@/components/feed/TrackCard";
import type { Track } from "@/types";
import { api } from "@/lib/api";

// Helper function to format numbers with labels
const formatCountWithLabel = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// Mock data for discover page - diverse genres with realistic content
const mockTracks: Track[] = [
  // Hip Hop
  {
    id: "hh1",
    userId: "user1",
    user: {
      id: "user1",
      username: "streetpoet",
      displayName: "Street Poet",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=streetpoet",
      followersCount: 245000,
      followingCount: 89,
      tracksCount: 67,
    },
    title: "Concrete Jungle",
    description: "Born and raised in the city",
    audioUrl: "/demo.mp3",
    videoUrl: "https://example.com/videos/urban.mp4",
    durationSeconds: 198,
    likesCount: 456000,
    commentsCount: 2340,
    remixesCount: 156,
    createdAt: "2025-01-15T10:30:00Z",
    tags: ["hiphop", "trap", "urban", "street"],
  },
  {
    id: "hh2",
    userId: "user2",
    user: {
      id: "user2",
      username: "boom_bap_king",
      displayName: "Boom Bap King",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=boombap",
      followersCount: 189000,
      followingCount: 156,
      tracksCount: 45,
    },
    title: "Golden Era",
    description: "Classic boom bap vibes",
    audioUrl: "/demo.mp3",
    durationSeconds: 215,
    likesCount: 312000,
    commentsCount: 1890,
    remixesCount: 89,
    createdAt: "2025-01-14T18:20:00Z",
    tags: ["hiphop", "boom bap", "classic", "lyrics"],
  },
  {
    id: "hh3",
    userId: "user3",
    user: {
      id: "user3",
      username: "uk_drill_og",
      displayName: "UK Drill OG",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ukdrill",
      followersCount: 345000,
      followingCount: 67,
      tracksCount: 34,
    },
    title: "London Streets",
    description: "UK drill heat",
    audioUrl: "/demo.mp3",
    videoUrl: "https://example.com/videos/london.mp4",
    durationSeconds: 165,
    likesCount: 789000,
    commentsCount: 4560,
    remixesCount: 345,
    createdAt: "2025-01-13T22:15:00Z",
    tags: ["hiphop", "drill", "uk drill", "dark"],
  },
  {
    id: "hh4",
    userId: "user4",
    user: {
      id: "user4",
      username: "conscious_rapper",
      displayName: "Conscious Rapper",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=conscious",
      followersCount: 156000,
      followingCount: 234,
      tracksCount: 89,
    },
    title: "Mind State",
    description: "Thought provoking hiphop",
    audioUrl: "/demo.mp3",
    durationSeconds: 245,
    likesCount: 234000,
    commentsCount: 980,
    remixesCount: 67,
    createdAt: "2025-01-12T14:30:00Z",
    tags: ["hiphop", "conscious", "lyrics", "message"],
  },
  {
    id: "hh5",
    userId: "user5",
    user: {
      id: "user5",
      username: "party_rapper",
      displayName: "Party Rapper",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=party",
      followersCount: 567000,
      followingCount: 123,
      tracksCount: 56,
    },
    title: "Turn Up Friday",
    description: "Weekend party starter",
    audioUrl: "/demo.mp3",
    durationSeconds: 182,
    likesCount: 567000,
    commentsCount: 3450,
    remixesCount: 234,
    createdAt: "2025-01-11T20:00:00Z",
    tags: ["hiphop", "party", "club", "hype"],
  },

  // Electronic
  {
    id: "el1",
    userId: "user6",
    user: {
      id: "user6",
      username: "synthwave_queen",
      displayName: "SynthWave Queen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=synthwave",
      followersCount: 178000,
      followingCount: 234,
      tracksCount: 56,
    },
    title: "Neon Nights",
    description: "Drive into the night",
    audioUrl: "/demo.mp3",
    durationSeconds: 245,
    likesCount: 345000,
    commentsCount: 1230,
    remixesCount: 89,
    createdAt: "2025-01-15T09:00:00Z",
    tags: ["electronic", "synthwave", "retro", "80s"],
  },
  {
    id: "el2",
    userId: "user7",
    user: {
      id: "user7",
      username: "deep_house_collective",
      displayName: "Deep House Collective",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=deephouse",
      followersCount: 234000,
      followingCount: 178,
      tracksCount: 78,
    },
    title: "Ocean Depths",
    description: "Deep house for late nights",
    audioUrl: "/demo.mp3",
    durationSeconds: 380,
    likesCount: 456000,
    commentsCount: 1890,
    remixesCount: 123,
    createdAt: "2025-01-14T02:30:00Z",
    tags: ["electronic", "deep house", "dance", "chill"],
  },
  {
    id: "el3",
    userId: "user8",
    user: {
      id: "user8",
      username: "dubstep_nexus",
      displayName: "Dubstep Nexus",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dubstep",
      followersCount: 567000,
      followingCount: 89,
      tracksCount: 45,
    },
    title: "Bass Drop City",
    description: "Heavy dubstep vibes",
    audioUrl: "/demo.mp3",
    durationSeconds: 210,
    likesCount: 890000,
    commentsCount: 5670,
    remixesCount: 456,
    createdAt: "2025-01-13T18:45:00Z",
    tags: ["electronic", "dubstep", "bass", "heavy"],
  },
  {
    id: "el4",
    userId: "user9",
    user: {
      id: "user9",
      username: "trance_state",
      displayName: "Trance State",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=trance",
      followersCount: 145000,
      followingCount: 267,
      tracksCount: 98,
    },
    title: "Euphoria",
    description: "Uplifting trance journey",
    audioUrl: "/demo.mp3",
    durationSeconds: 420,
    likesCount: 234000,
    commentsCount: 890,
    remixesCount: 78,
    createdAt: "2025-01-12T11:15:00Z",
    tags: ["electronic", "trance", "uplifting", "progressive"],
  },
  {
    id: "el5",
    userId: "user10",
    user: {
      id: "user10",
      username: "techno_warehouse",
      displayName: "Techno Warehouse",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=techno",
      followersCount: 198000,
      followingCount: 156,
      tracksCount: 67,
    },
    title: "Berlin Nights",
    description: "Raw techno from the source",
    audioUrl: "/demo.mp3",
    videoUrl: "https://example.com/videos/techno.mp4",
    durationSeconds: 345,
    likesCount: 345000,
    commentsCount: 1560,
    remixesCount: 134,
    createdAt: "2025-01-11T04:00:00Z",
    tags: ["electronic", "techno", "berlin", "industrial"],
  },

  // Rock
  {
    id: "rk1",
    userId: "user11",
    user: {
      id: "user11",
      username: "guitar_hero_88",
      displayName: "Guitar Hero 88",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=guitarhero",
      followersCount: 345000,
      followingCount: 234,
      tracksCount: 89,
    },
    title: "Breaking Free",
    description: "Arena rock anthem",
    audioUrl: "/demo.mp3",
    videoUrl: "https://example.com/videos/rock.mp4",
    durationSeconds: 267,
    likesCount: 567000,
    commentsCount: 2340,
    remixesCount: 89,
    createdAt: "2025-01-15T14:30:00Z",
    tags: ["rock", "arena rock", "guitar", "anthem"],
  },
  {
    id: "rk2",
    userId: "user12",
    user: {
      id: "user12",
      username: "indie_souls",
      displayName: "Indie Souls",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=indiesouls",
      followersCount: 178000,
      followingCount: 345,
      tracksCount: 56,
    },
    title: "Wild Hearts",
    description: "Indie rock with soul",
    audioUrl: "/demo.mp3",
    durationSeconds: 234,
    likesCount: 234000,
    commentsCount: 980,
    remixesCount: 67,
    createdAt: "2025-01-14T16:45:00Z",
    tags: ["rock", "indie", "alternative", "soulful"],
  },
  {
    id: "rk3",
    userId: "user13",
    user: {
      id: "user13",
      username: "punk_rebels",
      displayName: "Punk Rebels",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=punk",
      followersCount: 89000,
      followingCount: 456,
      tracksCount: 123,
    },
    title: "No Rules",
    description: "Fast paced punk energy",
    audioUrl: "/demo.mp3",
    durationSeconds: 145,
    likesCount: 156000,
    commentsCount: 890,
    remixesCount: 45,
    createdAt: "2025-01-13T12:00:00Z",
    tags: ["rock", "punk", "fast", "rebellious"],
  },
  {
    id: "rk4",
    userId: "user14",
    user: {
      id: "user14",
      username: "metal_thunder",
      displayName: "Metal Thunder",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=metal",
      followersCount: 456000,
      followingCount: 78,
      tracksCount: 67,
    },
    title: "Shadow Realm",
    description: "Heavy metal intensity",
    audioUrl: "/demo.mp3",
    durationSeconds: 312,
    likesCount: 567000,
    commentsCount: 2340,
    remixesCount: 189,
    createdAt: "2025-01-12T10:30:00Z",
    tags: ["rock", "metal", "heavy", "dark"],
  },
  {
    id: "rk5",
    userId: "user15",
    user: {
      id: "user15",
      username: "folk_road",
      displayName: "Folk Road",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=folk",
      followersCount: 234000,
      followingCount: 189,
      tracksCount: 45,
    },
    title: "Mountain High",
    description: "Folk rock for the soul",
    audioUrl: "/demo.mp3",
    durationSeconds: 278,
    likesCount: 345000,
    commentsCount: 1560,
    remixesCount: 98,
    createdAt: "2025-01-11T08:15:00Z",
    tags: ["rock", "folk", "acoustic", "nature"],
  },

  // Pop
  {
    id: "pop1",
    userId: "user16",
    user: {
      id: "user16",
      username: "pop_star_dream",
      displayName: "Pop Star Dream",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=popstar",
      followersCount: 890000,
      followingCount: 45,
      tracksCount: 34,
    },
    title: "Starlight",
    description: "Catchy pop anthem",
    audioUrl: "/demo.mp3",
    durationSeconds: 195,
    likesCount: 1234000,
    commentsCount: 8900,
    remixesCount: 567,
    createdAt: "2025-01-15T12:00:00Z",
    tags: ["pop", "upbeat", "catchy", "dance"],
  },
  {
    id: "pop2",
    userId: "user17",
    user: {
      id: "user17",
      username: "synth_pop_vibes",
      displayName: "Synth Pop Vibes",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=synthpop",
      followersCount: 234000,
      followingCount: 167,
      tracksCount: 56,
    },
    title: "Digital Love",
    description: "Modern synth pop",
    audioUrl: "/demo.mp3",
    durationSeconds: 215,
    likesCount: 456000,
    commentsCount: 1890,
    remixesCount: 123,
    createdAt: "2025-01-14T20:30:00Z",
    tags: ["pop", "synth pop", "electronic", "80s"],
  },
  {
    id: "pop3",
    userId: "user18",
    user: {
      id: "user18",
      username: "disco_queen",
      displayName: "Disco Queen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=disco",
      followersCount: 345000,
      followingCount: 234,
      tracksCount: 67,
    },
    title: "Saturday Night",
    description: "Disco funk revival",
    audioUrl: "/demo.mp3",
    durationSeconds: 234,
    likesCount: 567000,
    commentsCount: 2340,
    remixesCount: 167,
    createdAt: "2025-01-13T15:45:00Z",
    tags: ["pop", "disco", "funk", "dance"],
  },
  {
    id: "pop4",
    userId: "user19",
    user: {
      id: "user19",
      username: "ballad_master",
      displayName: "Ballad Master",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ballad",
      followersCount: 456000,
      followingCount: 345,
      tracksCount: 89,
    },
    title: "Eternal Flame",
    description: "Power ballad for the heart",
    audioUrl: "/demo.mp3",
    durationSeconds: 267,
    likesCount: 678000,
    commentsCount: 3450,
    remixesCount: 198,
    createdAt: "2025-01-12T22:00:00Z",
    tags: ["pop", "ballad", "romance", "power ballad"],
  },
  {
    id: "pop5",
    userId: "user20",
    user: {
      id: "user20",
      username: "teen_dream",
      displayName: "Teen Dream",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=teendream",
      followersCount: 567000,
      followingCount: 89,
      tracksCount: 28,
    },
    title: "Crush",
    description: "Teen pop romance",
    audioUrl: "/demo.mp3",
    durationSeconds: 178,
    likesCount: 789000,
    commentsCount: 4560,
    remixesCount: 234,
    createdAt: "2025-01-11T18:30:00Z",
    tags: ["pop", "teen pop", "romance", "cute"],
  },

  // R&B
  {
    id: "rnb1",
    userId: "user21",
    user: {
      id: "user21",
      username: "soul_sista",
      displayName: "Soul Sista",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=soulsista",
      followersCount: 345000,
      followingCount: 178,
      tracksCount: 45,
    },
    title: "Midnight Calls",
    description: "Smooth R&B vibes",
    audioUrl: "/demo.mp3",
    durationSeconds: 234,
    likesCount: 456000,
    commentsCount: 2340,
    remixesCount: 145,
    createdAt: "2025-01-15T02:00:00Z",
    tags: ["rnb", "soul", "smooth", "romance"],
  },
  {
    id: "rnb2",
    userId: "user22",
    user: {
      id: "user22",
      username: "velvet_voice",
      displayName: "Velvet Voice",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=velvet",
      followersCount: 567000,
      followingCount: 234,
      tracksCount: 56,
    },
    title: "Silk",
    description: "Sensual R&B",
    audioUrl: "/demo.mp3",
    durationSeconds: 212,
    likesCount: 678000,
    commentsCount: 3450,
    remixesCount: 189,
    createdAt: "2025-01-14T04:30:00Z",
    tags: ["rnb", "sensual", "smooth", "love"],
  },
  {
    id: "rnb3",
    userId: "user23",
    user: {
      id: "user23",
      username: "90s_rnb_throwback",
      displayName: "90s RnB Throwback",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=90srnb",
      followersCount: 234000,
      followingCount: 345,
      tracksCount: 78,
    },
    title: "Old School Love",
    description: "90s R&B vibes",
    audioUrl: "/demo.mp3",
    durationSeconds: 256,
    likesCount: 345000,
    commentsCount: 1890,
    remixesCount: 98,
    createdAt: "2025-01-13T22:15:00Z",
    tags: ["rnb", "90s", "throwback", "classic"],
  },
  {
    id: "rnb4",
    userId: "user24",
    user: {
      id: "user24",
      username: "modern_rnb_star",
      displayName: "Modern RnB Star",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=modernrnb",
      followersCount: 789000,
      followingCount: 89,
      tracksCount: 34,
    },
    title: "Drift",
    description: "Contemporary R&B",
    audioUrl: "/demo.mp3",
    durationSeconds: 198,
    likesCount: 890000,
    commentsCount: 5670,
    remixesCount: 345,
    createdAt: "2025-01-12T14:00:00Z",
    tags: ["rnb", "contemporary", "modern", "trap soul"],
  },
  {
    id: "rnb5",
    userId: "user25",
    user: {
      id: "user25",
      username: "jazzy_rnb",
      displayName: "Jazzy RnB",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jazzyrnb",
      followersCount: 189000,
      followingCount: 267,
      tracksCount: 56,
    },
    title: "Coffee Shop Sessions",
    description: "Jazz-infused R&B",
    audioUrl: "/demo.mp3",
    durationSeconds: 278,
    likesCount: 234000,
    commentsCount: 1230,
    remixesCount: 78,
    createdAt: "2025-01-11T10:30:00Z",
    tags: ["rnb", "jazz", "chill", "smooth"],
  },

  // Jazz
  {
    id: "jz1",
    userId: "user26",
    user: {
      id: "user26",
      username: "jazz_cat_collective",
      displayName: "Jazz Cat Collective",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jazzcat",
      followersCount: 156000,
      followingCount: 345,
      tracksCount: 89,
    },
    title: "Blue Note",
    description: "Classic jazz improvisation",
    audioUrl: "/demo.mp3",
    durationSeconds: 345,
    likesCount: 234000,
    commentsCount: 980,
    remixesCount: 56,
    createdAt: "2025-01-15T08:00:00Z",
    tags: ["jazz", "bebop", "instrumental", "classic"],
  },
  {
    id: "jz2",
    userId: "user27",
    user: {
      id: "user27",
      username: "smooth_jazz_project",
      displayName: "Smooth Jazz Project",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=smoothjazz",
      followersCount: 234000,
      followingCount: 234,
      tracksCount: 67,
    },
    title: "Sunset Boulevard",
    description: "Smooth jazz for relaxation",
    audioUrl: "/demo.mp3",
    durationSeconds: 312,
    likesCount: 345000,
    commentsCount: 1450,
    remixesCount: 89,
    createdAt: "2025-01-14T18:30:00Z",
    tags: ["jazz", "smooth jazz", "chill", "instrumental"],
  },
  {
    id: "jz3",
    userId: "user28",
    user: {
      id: "user28",
      username: "fusion_masters",
      displayName: "Fusion Masters",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fusion",
      followersCount: 189000,
      followingCount: 189,
      tracksCount: 45,
    },
    title: "Electric Dreams",
    description: "Jazz fusion with electronic",
    audioUrl: "/demo.mp3",
    durationSeconds: 398,
    likesCount: 267000,
    commentsCount: 1230,
    remixesCount: 78,
    createdAt: "2025-01-13T14:45:00Z",
    tags: ["jazz", "fusion", "electronic", "experimental"],
  },
  {
    id: "jz4",
    userId: "user29",
    user: {
      id: "user29",
      username: "piano_dreams",
      displayName: "Piano Dreams",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=piano",
      followersCount: 98000,
      followingCount: 456,
      tracksCount: 56,
    },
    title: "Piano in the Dark",
    description: "Solo piano jazz",
    audioUrl: "/demo.mp3",
    durationSeconds: 267,
    likesCount: 156000,
    commentsCount: 780,
    remixesCount: 45,
    createdAt: "2025-01-12T22:00:00Z",
    tags: ["jazz", "piano", "solo", "instrumental"],
  },
  {
    id: "jz5",
    userId: "user30",
    user: {
      id: "user30",
      username: "big_band_sounds",
      displayName: "Big Band Sounds",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bigband",
      followersCount: 123000,
      followingCount: 267,
      tracksCount: 34,
    },
    title: "Swing Nights",
    description: "Big band swing jazz",
    audioUrl: "/demo.mp3",
    durationSeconds: 289,
    likesCount: 198000,
    commentsCount: 890,
    remixesCount: 67,
    createdAt: "2025-01-11T20:15:00Z",
    tags: ["jazz", "big band", "swing", "brass"],
  },

  // LoFi
  {
    id: "lofi1",
    userId: "user31",
    user: {
      id: "user31",
      username: "lofi_dreams",
      displayName: "Lofi Dreams",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lofidreams",
      followersCount: 678000,
      followingCount: 89,
      tracksCount: 134,
    },
    title: "Rainy Window",
    description: "Perfect for studying",
    audioUrl: "/demo.mp3",
    durationSeconds: 180,
    likesCount: 1234000,
    commentsCount: 6780,
    remixesCount: 456,
    createdAt: "2025-01-15T06:00:00Z",
    tags: ["lofi", "chill", "study", "rain"],
  },
  {
    id: "lofi2",
    userId: "user32",
    user: {
      id: "user32",
      username: "chill_beats_radio",
      displayName: "Chill Beats Radio",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=chillbeats",
      followersCount: 456000,
      followingCount: 156,
      tracksCount: 89,
    },
    title: "Late Night Study",
    description: "Lofi beats to study to",
    audioUrl: "/demo.mp3",
    durationSeconds: 195,
    likesCount: 890000,
    commentsCount: 4560,
    remixesCount: 289,
    createdAt: "2025-01-14T02:30:00Z",
    tags: ["lofi", "study", "chill", "beats"],
  },
  {
    id: "lofi3",
    userId: "user33",
    user: {
      id: "user33",
      username: "coffee_shop_lofi",
      displayName: "Coffee Shop Lofi",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=coffee",
      followersCount: 345000,
      followingCount: 234,
      tracksCount: 67,
    },
    title: "Sunday Mornings",
    description: "Vintage vibes",
    audioUrl: "/demo.mp3",
    durationSeconds: 210,
    likesCount: 567000,
    commentsCount: 2890,
    remixesCount: 178,
    createdAt: "2025-01-13T10:45:00Z",
    tags: ["lofi", "vintage", "chill", "morning"],
  },
  {
    id: "lofi4",
    userId: "user34",
    user: {
      id: "user34",
      username: "vinyl_lofi",
      displayName: "Vinyl Lofi",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=vinyl",
      followersCount: 234000,
      followingCount: 189,
      tracksCount: 56,
    },
    title: "Dusty Memories",
    description: "Lofi with vinyl crackle",
    audioUrl: "/demo.mp3",
    durationSeconds: 178,
    likesCount: 456000,
    commentsCount: 2340,
    remixesCount: 145,
    createdAt: "2025-01-12T18:00:00Z",
    tags: ["lofi", "vinyl", "nostalgic", "vintage"],
  },
  {
    id: "lofi5",
    userId: "user35",
    user: {
      id: "user35",
      username: "dreamy_lofi",
      displayName: "Dreamy Lofi",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dreamy",
      followersCount: 567000,
      followingCount: 123,
      tracksCount: 78,
    },
    title: "Cloud Nine",
    description: "Float away with dreamy lofi",
    audioUrl: "/demo.mp3",
    durationSeconds: 165,
    likesCount: 789000,
    commentsCount: 4120,
    remixesCount: 267,
    createdAt: "2025-01-11T04:15:00Z",
    tags: ["lofi", "dreamy", "chill", "sleep"],
  },

  // Afrobeats
  {
    id: "afro1",
    userId: "user36",
    user: {
      id: "user36",
      username: "afro_king",
      displayName: "Afro King",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=afroking",
      followersCount: 890000,
      followingCount: 67,
      tracksCount: 45,
    },
    title: "Afro Beat Party",
    description: "Dance to the rhythm",
    audioUrl: "/demo.mp3",
    durationSeconds: 198,
    likesCount: 1340000,
    commentsCount: 7890,
    remixesCount: 567,
    createdAt: "2025-01-15T14:00:00Z",
    tags: ["afrobeats", "dance", "party", "african"],
  },
  {
    id: "afro2",
    userId: "user37",
    user: {
      id: "user37",
      username: "naija_vibes",
      displayName: "Naija Vibes",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=naija",
      followersCount: 567000,
      followingCount: 123,
      tracksCount: 56,
    },
    title: "Afrobeats Deluxe",
    description: "Premium African rhythms",
    audioUrl: "/demo.mp3",
    durationSeconds: 195,
    likesCount: 456000,
    commentsCount: 7890,
    remixesCount: 567,
    createdAt: "2025-01-15T14:00:00Z",
    tags: ["afrobeats", "dance", "party", "african"],
  },
  {
    id: "afro3",
    userId: "user38",
    user: {
      id: "user38",
      username: "sahara_sounds",
      displayName: "Sahara Sounds",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sahara",
      followersCount: 234000,
      followingCount: 89,
      tracksCount: 34,
    },
    title: "Desert Storm",
    description: "North African fusion beats",
    audioUrl: "/demo.mp3",
    videoUrl: "https://example.com/videos/desert.mp4",
    durationSeconds: 210,
    likesCount: 567000,
    commentsCount: 4560,
    remixesCount: 234,
    createdAt: "2025-01-12T11:00:00Z",
    tags: ["afrobeats", "desert", "fusion", "world"],
  },
  {
    id: "afro4",
    userId: "user39",
    user: {
      id: "user39",
      username: "accra_glow",
      displayName: "Accra Glow",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=accra",
      followersCount: 189000,
      followingCount: 156,
      tracksCount: 28,
    },
    title: "Ghana Gold",
    description: "Coastal Ghana vibes",
    audioUrl: "/demo.mp3",
    durationSeconds: 185,
    likesCount: 345000,
    commentsCount: 2890,
    remixesCount: 178,
    createdAt: "2025-01-10T16:30:00Z",
    tags: ["afrobeats", "ghana", "coastal", "vibes"],
  },
  {
    id: "afro5",
    userId: "user40",
    user: {
      id: "user40",
      username: "jollof_king",
      displayName: "Jollof King",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jollof",
      followersCount: 312000,
      followingCount: 78,
      tracksCount: 42,
    },
    title: "West Coast Wave",
    description: "Nigerian-inspired heat",
    audioUrl: "/demo.mp3",
    durationSeconds: 200,
    likesCount: 678000,
    commentsCount: 5670,
    remixesCount: 345,
    createdAt: "2025-01-08T20:00:00Z",
    tags: ["afrobeats", "nigerian", "west africa", "party"],
  },
  // Indie
  {
    id: "indie1",
    userId: "user41",
    user: {
      id: "user41",
      username: "indie_soul",
      displayName: "Indie Soul",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=indiesoul",
      followersCount: 234000,
      followingCount: 234,
      tracksCount: 45,
    },
    title: "Coffee Shop Days",
    description: "Indie vibes for lazy afternoons",
    audioUrl: "/demo.mp3",
    videoUrl: "https://example.com/videos/indie.mp4",
    durationSeconds: 245,
    likesCount: 456000,
    commentsCount: 2340,
    remixesCount: 89,
    createdAt: "2025-01-14T14:30:00Z",
    tags: ["indie", "folk", "acoustic", "chill"],
  },
  {
    id: "indie2",
    userId: "user42",
    user: {
      id: "user42",
      username: "dream_popper",
      displayName: "Dream Popper",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dreampop",
      followersCount: 189000,
      followingCount: 189,
      tracksCount: 32,
    },
    title: "Neon Garden",
    description: "Dreamy indie soundscapes",
    audioUrl: "/demo.mp3",
    durationSeconds: 280,
    likesCount: 345000,
    commentsCount: 1890,
    remixesCount: 67,
    createdAt: "2025-01-12T19:45:00Z",
    tags: ["indie", "dream pop", "shoegaze", "ethereal"],
  },
  {
    id: "indie3",
    userId: "user43",
    user: {
      id: "user43",
      username: "garage_hero",
      displayName: "Garage Hero",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=garage",
      followersCount: 156000,
      followingCount: 312,
      tracksCount: 56,
    },
    title: " Basement Sessions",
    description: "Raw indie rock energy",
    audioUrl: "/demo.mp3",
    durationSeconds: 198,
    likesCount: 234000,
    commentsCount: 1560,
    remixesCount: 45,
    createdAt: "2025-01-10T21:15:00Z",
    tags: ["indie", "garage", "rock", "raw"],
  },
  {
    id: "indie4",
    userId: "user44",
    user: {
      id: "user44",
      username: "bedroom_producer",
      displayName: "Bedroom Producer",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bedroom",
      followersCount: 456000,
      followingCount: 456,
      tracksCount: 78,
    },
    title: "Home Studio Magic",
    description: "Made entirely in my bedroom",
    audioUrl: "/demo.mp3",
    durationSeconds: 220,
    likesCount: 789000,
    commentsCount: 6780,
    remixesCount: 234,
    createdAt: "2025-01-08T15:00:00Z",
    tags: ["indie", "bedroom pop", "synth", "DIY"],
  },
  {
    id: "indie5",
    userId: "user45",
    user: {
      id: "user45",
      username: "anthem_maker",
      displayName: "Anthem Maker",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=anthem",
      followersCount: 312000,
      followingCount: 178,
      tracksCount: 39,
    },
    title: "Summer of Indie",
    description: "The ultimate summer anthem",
    audioUrl: "/demo.mp3",
    videoUrl: "https://example.com/videos/summer.mp4",
    durationSeconds: 195,
    likesCount: 890000,
    commentsCount: 8900,
    remixesCount: 456,
    createdAt: "2025-01-06T12:00:00Z",
    tags: ["indie", "summer", "anthem", "upbeat"],
  },
];

const mockRemixes = [
  { 
    id: "1", 
    title: "Summer Vibe Remix", 
    user: { username: "remixer1", displayName: "Remixer One", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=remixer1" }, 
    bpm: 128,
    likesCount: 5400,
    remixesCount: 12,
    audioUrl: "/demo.mp3",
  },
  { 
    id: "2", 
    title: "Chill Mix", 
    user: { username: "chill_guy", displayName: "Chill Guy", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=chill" }, 
    bpm: 95,
    likesCount: 3200,
    remixesCount: 8,
    audioUrl: "/demo.mp3",
  },
  { 
    id: "3", 
    title: "Neon Lights Remix", 
    user: { username: "dj_energy", displayName: "DJ Energy", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj" }, 
    bpm: 140,
    likesCount: 8900,
    remixesCount: 24,
    audioUrl: "/demo.mp3",
  },
];
export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  // Initialize with mock data so page shows content immediately
  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [isLoading, setIsLoading] = useState(false); // Start with false since we have mock data
  const [error, setError] = useState<string | null>(null);

  const categories = ["All", "Hip Hop", "Electronic", "Rock", "Pop", "R&B", "Jazz", "LoFi", "Afrobeats"];

  useEffect(() => {
    // Silent fetch in background - page already has mock data
    fetchDiscoverTracks().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchDiscoverTracks = async () => {
    setError(null);
    try {
      const response = await api.feed.getDiscover({ 
        limit: 20, 
        offset: 0,
        genre: selectedCategory !== 'All' ? selectedCategory : undefined 
      });
      
      // Use mock data fallback if API fails or returns no data
      if (response.error || !response.data) {
        setTracks(mockTracks);
      } else if (typeof response.data === 'object' && 'tracks' in response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fetchedTracks = (response.data as any).tracks as Track[];
        if (fetchedTracks.length > 0) {
          setTracks(fetchedTracks);
        }
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        setTracks(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const filters = [
    { id: "trending", label: "Trending", active: true },
    { id: "new", label: "New Releases", active: false },
    { id: "remixes", label: "Remixes", active: false },
    { id: "following", label: "Following", active: false },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <TopBar
        title="Discover"
        transparent
        rightAction={
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-primary-500 text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        }
      />

      <div className="pt-14 pb-20 px-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists, hashtags..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3">Filter by</h3>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  aria-label={`Filter by ${filter.label}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter.active
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-label={`Select ${category} category`}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-primary-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Section Header with Labels */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              🔥 Trending Now
            </h2>
            <span className="text-sm text-neutral-500">
              {formatCountWithLabel(5000)} plays
            </span>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-10">{error}</p>
          ) : (
            <TrendingTracks
              tracks={tracks}
              onTrackClick={(id) => console.log("Track:", id)}
            />
          )}
        </section>

        {/* Featured Remixes */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              ⭐ Featured Remixes
            </h2>
            <span className="text-sm text-neutral-500">
              {formatCountWithLabel(150)} remixes
            </span>
          </div>
          <FeaturedRemixes
            remixes={mockRemixes}
            onRemixClick={(id) => console.log("Featured remix:", id)}
          />
        </section>

        {/* New Releases with labels */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              🎵 New Releases
            </h2>
            <span className="text-sm text-neutral-500">
              {formatCountWithLabel(234)} new tracks
            </span>
          </div>
          <div className="space-y-3">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                variant="horizontal"
                onClick={() => {}}
                onLike={() => {}}
                onRemix={() => {}}
                onShare={() => {}}
              />
            ))}
          </div>
        </section>

        {/* Recommended Artists with followers label */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              👥 Artists to Follow
            </h2>
            <span className="text-sm text-neutral-500">
              {formatCountWithLabel(12500)} new followers
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 text-center cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-primary-500 group-hover:scale-105 transition-transform">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=artist${i}`}
                    alt={`Artist ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  artist_{i}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatCountWithLabel(100 + i * 50)} followers
                </p>
                <button className="mt-2 px-3 py-1 text-xs font-medium bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Top Charts Section */}
        <section className="py-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
            📊 Top Charts
          </h2>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center gap-4 p-4 ${
                  index !== tracks.length - 1 
                    ? "border-b border-neutral-100 dark:border-neutral-800" 
                    : ""
                } hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer`}
              >
                <span className={`text-2xl font-bold w-8 ${
                  index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-neutral-400"
                }`}>
                  {index + 1}
                </span>
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary-500 to-purple-600 flex-shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=chart${index}`}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 dark:text-white truncate">
                    {track.title}
                  </p>
                  <p className="text-sm text-neutral-500">@{track.user.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    ❤️ {formatCountWithLabel(track.likesCount)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    🔄 {formatCountWithLabel(track.remixesCount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
