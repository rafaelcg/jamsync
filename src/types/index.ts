// JamSync Type Definitions

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  email?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  tracksCount: number;
  isFollowing?: boolean;
  createdAt?: string;
}

export interface Track {
  id: string;
  userId: string;
  user: User;
  title: string;
  description?: string;
  audioUrl: string;
  videoUrl?: string;
  waveformData?: number[];
  durationSeconds: number;
  likesCount: number;
  commentsCount: number;
  remixesCount: number;
  isLiked?: boolean;
  isRemixed?: boolean;
  originalTrackId?: string;
  originalTrack?: Track;
  remixes?: Track[];
  isMain?: boolean;
  mainTrackId?: string;
  createdAt: string;
  tags?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  trackId: string;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface Remix {
  originalTrackId: string;
  remixTrackId: string;
  promotedAt?: string;
}

// Feed types
export interface FeedItem {
  track: Track;
  index: number;
}

// Navigation types
export type TabItem = "home" | "discover" | "upload" | "notifications" | "profile" | "for-you" | "trending";

// Modal types
export type ModalType = "upload" | "remix" | "share" | "comments" | "none";

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (track: Partial<Track>) => void;
}

export interface RemixModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalTrack: Track | null;
  onRemix: (track: Partial<Track>) => void;
}

// Component Props
export interface VideoFeedProps {
  tracks: Track[];
  onTrackClick?: (track: Track) => void;
  onLike?: (trackId: string) => void;
  onRemix?: (track: Track) => void;
  onShare?: (track: Track) => void;
}

export interface TrackCardProps {
  track: Track;
  variant?: "feed" | "grid" | "list" | "horizontal";
  onClick?: () => void;
  onLike?: () => void;
  onRemix?: () => void;
  onShare?: () => void;
}

export interface UserProfileProps {
  user: User;
  tracks: Track[];
  isOwnProfile?: boolean;
  activeTab?: "tracks" | "remixes" | "liked";
  onEditProfile?: () => void;
  onFollow?: () => void;
}

export interface NavigationProps {
  activeTab: TabItem;
  onTabChange: (tab: TabItem) => void;
  unreadNotifications?: number;
}

export interface MainSectionProps {
  remixes: Track[];
  originalTrack?: Track;
  onRemixClick?: (track: Track) => void;
  onPromote?: (remixId: string) => void;
}

// API Response types
export interface FeedResponse {
  tracks: Track[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface FeedParams {
  cursor?: string;
  type?: 'timeline' | 'trending' | 'discover' | 'following';
  limit?: number;
}

export interface UserResponse {
  user: User;
  tracks: Track[];
}

// Utility types
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Upload progress
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// API Response type
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}
