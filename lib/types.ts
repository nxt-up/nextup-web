// TypeScript types matching iOS Swift models

export interface TMDBNetwork {
  id: number;
  name: string;
  logoPath?: string;
  originCountry?: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBSeason {
  id: number;
  seasonNumber: number;
  name: string;
  overview?: string;
  posterPath?: string;
  airDate?: string;
  episodeCount?: number;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview?: string;
  stillPath?: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate?: string;
  runtime?: number;
  voteAverage?: number;
  voteCount?: number;
  episodeType?: string;
}

export interface TMDBShow {
  id: number;
  name: string;
  originalName?: string;
  overview: string;
  posterPath?: string;
  backdropPath?: string;
  firstAirDate?: string;
  lastAirDate?: string;
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  numberOfEpisodes?: number;
  numberOfSeasons?: number;
  status?: string;
  type?: string;
  inProduction?: boolean;
  genreIds?: number[];
  genres?: TMDBGenre[];
  networks?: TMDBNetwork[];
  seasons?: TMDBSeason[];
  nextEpisodeToAir?: TMDBEpisode;
  lastEpisodeToAir?: TMDBEpisode;
  homepage?: string;
  tagline?: string;
}

export interface FollowedShow {
  showId: number;
  name: string;
  posterPath?: string;
  backdropPath?: string;
  status?: string;
  inProduction?: boolean;
  type?: string;
  totalSeasons?: number;
  totalEpisodes?: number;
  followedDate?: string;
  lastViewedDate?: string;
  notificationsEnabled?: boolean;
  nextEpisodeToAir?: {
    airDate: string;
    seasonNumber: number;
    episodeNumber: number;
    name?: string;
  };
  genreIds?: number[];
  watchProviderIds?: number[];
}

export type WatchHistoryVisibility = 'everyone' | 'followersOnly' | 'private';

export interface User {
  id: string;
  email?: string;
  username?: string;
  fullName?: string;
  avatarURL?: string;
  isPrivate: boolean;
  watchHistoryVisibility: WatchHistoryVisibility;
  followerCount?: number;
  followingCount?: number;
  createdAt?: string;
}

export interface WatchedEpisode {
  showId: number;
  showName: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeName?: string;
  watchedDate: string;
  runtime?: number;
  progress?: number;
}

// Cache types
export interface CachedShow {
  tmdbData: TMDBShow;
  cachedAt: Date;
  lastFetchedFrom: 'firestore' | 'tmdb';
}

export interface CachedEpisode {
  tmdbData: TMDBEpisode;
  cachedAt: Date;
}

// TMDB Image helpers
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getTMDBImageUrl = (
  path: string | null | undefined,
  size: 'w185' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'
): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getTMDBPosterUrl = (
  posterPath: string | null | undefined
): string | null => {
  return getTMDBImageUrl(posterPath, 'w500');
};

export const getTMDBBackdropUrl = (
  backdropPath: string | null | undefined
): string | null => {
  return getTMDBImageUrl(backdropPath, 'w780');
};

export const getTMDBStillUrl = (
  stillPath: string | null | undefined
): string | null => {
  return getTMDBImageUrl(stillPath, 'w500');
};

// URL slug helpers
export const createShowSlug = (showId: number, showName: string): string => {
  const slug = showName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${showId}-${slug}`;
};

export const parseShowSlug = (slug: string): number | null => {
  // Support both formats: "1396-breaking-bad" and "1396"
  const withSlugMatch = slug.match(/^(\d+)-/);
  if (withSlugMatch) {
    return parseInt(withSlugMatch[1], 10);
  }

  // Support legacy numeric-only format
  const numericMatch = slug.match(/^(\d+)$/);
  if (numericMatch) {
    return parseInt(numericMatch[1], 10);
  }

  return null;
};
