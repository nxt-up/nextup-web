import axios from 'axios';
import { db } from './firebase-admin';
import type { TMDBShow, TMDBEpisode } from './types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Rate limiting (conservative)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 25; // 40 requests per second max

async function rateLimitedRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }

  lastRequestTime = Date.now();
  return requestFn();
}

/**
 * Get show details from cache or TMDB
 * Cache-first strategy: Check Firestore -> Fetch from TMDB -> Save to cache
 */
export async function getShowDetails(showId: string): Promise<TMDBShow> {
  // 1. Check Firestore cache
  const cacheRef = db.collection('web_cache').doc(`show_${showId}`);

  try {
    const cached = await cacheRef.get();

    if (cached.exists) {
      const data = cached.data();
      if (!data) {
        console.log(`[TMDB] Empty cache for show ${showId}`);
      } else {
        const cachedAt =
          data.cachedAt instanceof Date
            ? data.cachedAt.getTime()
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (data.cachedAt as any)?.toMillis?.() || 0;
        const age = Date.now() - cachedAt;

        // Return cached data if not stale
        if (age < CACHE_TTL && data.tmdbData) {
          console.log(`[TMDB] Cache hit for show ${showId}`);
          // Convert snake_case to camelCase for TMDB fields
          const tmdbData = data.tmdbData;
          return {
            ...tmdbData,
            posterPath: tmdbData.poster_path || tmdbData.posterPath,
            backdropPath: tmdbData.backdrop_path || tmdbData.backdropPath,
            numberOfSeasons:
              tmdbData.number_of_seasons || tmdbData.numberOfSeasons,
            numberOfEpisodes:
              tmdbData.number_of_episodes || tmdbData.numberOfEpisodes,
            voteAverage: tmdbData.vote_average || tmdbData.voteAverage,
            voteCount: tmdbData.vote_count || tmdbData.voteCount,
            firstAirDate: tmdbData.first_air_date || tmdbData.firstAirDate,
            lastAirDate: tmdbData.last_air_date || tmdbData.lastAirDate,
            originalName: tmdbData.original_name || tmdbData.originalName,
            inProduction: tmdbData.in_production ?? tmdbData.inProduction,
          } as TMDBShow;
        }

        console.log(`[TMDB] Cache stale for show ${showId}, refreshing...`);
      }
    }
  } catch (error) {
    console.error(`[TMDB] Cache read error for show ${showId}:`, error);
    // Continue to fetch from TMDB on cache error
  }

  // 2. Fetch from TMDB
  console.log(`[TMDB] Fetching show ${showId} from API`);

  try {
    const rawShow = await rateLimitedRequest(async () => {
      const response = await axios.get<TMDBShow>(
        `${TMDB_BASE_URL}/tv/${showId}`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            append_to_response: 'external_ids',
          },
        }
      );
      return response.data;
    });

    // Convert snake_case to camelCase for consistency
    const rawData = rawShow as Record<string, unknown>;
    const show: TMDBShow = {
      ...rawShow,
      posterPath: (rawData.poster_path as string) || rawShow.posterPath,
      backdropPath: (rawData.backdrop_path as string) || rawShow.backdropPath,
      numberOfSeasons:
        (rawData.number_of_seasons as number) || rawShow.numberOfSeasons,
      numberOfEpisodes:
        (rawData.number_of_episodes as number) || rawShow.numberOfEpisodes,
      voteAverage: (rawData.vote_average as number) || rawShow.voteAverage,
      voteCount: (rawData.vote_count as number) || rawShow.voteCount,
      firstAirDate: (rawData.first_air_date as string) || rawShow.firstAirDate,
      lastAirDate: (rawData.last_air_date as string) || rawShow.lastAirDate,
      originalName: (rawData.original_name as string) || rawShow.originalName,
      inProduction: (rawData.in_production as boolean) ?? rawShow.inProduction,
    };

    // 3. Save to cache (blocking to ensure data is available immediately)
    // Convert to plain object to avoid Firestore serialization issues
    const cacheData = {
      tmdbData: JSON.parse(JSON.stringify(rawShow)), // Save original for cache
      cachedAt: new Date(),
      lastFetchedFrom: 'tmdb' as const,
    };

    try {
      await cacheRef.set(cacheData);
      console.log(`[TMDB] Cached show ${showId} successfully`);
    } catch (error) {
      console.error(`[TMDB] Cache write error for show ${showId}:`, error);
    }

    return show;
  } catch (error) {
    console.error(`[TMDB] FAILED to fetch show ${showId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error(`[TMDB] API Error:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
}

/**
 * Get episode details from cache or TMDB
 */
export async function getEpisodeDetails(
  showId: string,
  seasonNum: string,
  episodeNum: string
): Promise<TMDBEpisode> {
  const cacheKey = `episode_${showId}_s${seasonNum}_e${episodeNum}`;
  const cacheRef = db.collection('web_cache').doc(cacheKey);

  try {
    const cached = await cacheRef.get();

    if (cached.exists) {
      const data = cached.data();
      if (data && data.tmdbData) {
        const cachedAt =
          data.cachedAt instanceof Date
            ? data.cachedAt.getTime()
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (data.cachedAt as any)?.toMillis?.() || 0;
        const age = Date.now() - cachedAt;

        if (age < CACHE_TTL) {
          console.log(
            `[TMDB] Cache hit for episode ${showId} S${seasonNum}E${episodeNum}`
          );
          const tmdbData = data.tmdbData;
          return {
            ...tmdbData,
            stillPath: tmdbData.still_path || tmdbData.stillPath,
            seasonNumber: tmdbData.season_number || tmdbData.seasonNumber,
            episodeNumber: tmdbData.episode_number || tmdbData.episodeNumber,
            airDate: tmdbData.air_date || tmdbData.airDate,
            voteAverage: tmdbData.vote_average || tmdbData.voteAverage,
            voteCount: tmdbData.vote_count || tmdbData.voteCount,
            episodeType: tmdbData.episode_type || tmdbData.episodeType,
          } as TMDBEpisode;
        }
      }
    }
  } catch (error) {
    console.error(`[TMDB] Cache read error for episode ${cacheKey}:`, error);
  }

  // Fetch from TMDB
  console.log(
    `[TMDB] Fetching episode ${showId} S${seasonNum}E${episodeNum} from API`
  );

  const rawEpisode = await rateLimitedRequest(async () => {
    const response = await axios.get<TMDBEpisode>(
      `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNum}/episode/${episodeNum}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      }
    );
    return response.data;
  });

  // Convert snake_case to camelCase for consistency
  const rawData = rawEpisode as Record<string, unknown>;
  const episode: TMDBEpisode = {
    ...rawEpisode,
    stillPath: (rawData.still_path as string) || rawEpisode.stillPath,
    seasonNumber: (rawData.season_number as number) || rawEpisode.seasonNumber,
    episodeNumber:
      (rawData.episode_number as number) || rawEpisode.episodeNumber,
    airDate: (rawData.air_date as string) || rawEpisode.airDate,
    voteAverage: (rawData.vote_average as number) || rawEpisode.voteAverage,
    voteCount: (rawData.vote_count as number) || rawEpisode.voteCount,
    episodeType: (rawData.episode_type as string) || rawEpisode.episodeType,
  };

  // Save to cache (blocking to ensure data is available immediately)
  try {
    await cacheRef.set({
      tmdbData: rawEpisode, // Save original for cache
      cachedAt: new Date(),
    });
    console.log(`[TMDB] Cached episode ${cacheKey} successfully`);
  } catch (error) {
    console.error(`[TMDB] Cache write error for episode ${cacheKey}:`, error);
  }

  return episode;
}

/**
 * Get season details from TMDB
 */
export async function getSeasonDetails(
  showId: string,
  seasonNum: string
): Promise<{ episodes: TMDBEpisode[] }> {
  console.log(`[TMDB] Fetching season ${showId} S${seasonNum} from API`);

  const rawData = await rateLimitedRequest(async () => {
    const response = await axios.get<{ episodes: TMDBEpisode[] }>(
      `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNum}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      }
    );
    return response.data;
  });

  // Convert episodes from snake_case to camelCase
  const episodes: TMDBEpisode[] = rawData.episodes.map(
    (rawEp: Record<string, unknown>) => ({
      ...rawEp,
      stillPath: (rawEp.still_path as string) || (rawEp.stillPath as string),
      seasonNumber:
        (rawEp.season_number as number) || (rawEp.seasonNumber as number),
      episodeNumber:
        (rawEp.episode_number as number) || (rawEp.episodeNumber as number),
      airDate: (rawEp.air_date as string) || (rawEp.airDate as string),
      voteAverage:
        (rawEp.vote_average as number) || (rawEp.voteAverage as number),
      voteCount: (rawEp.vote_count as number) || (rawEp.voteCount as number),
      episodeType:
        (rawEp.episode_type as string) || (rawEp.episodeType as string),
    })
  );

  return { episodes };
}

/**
 * Search for shows by name
 */
export async function searchShows(query: string): Promise<TMDBShow[]> {
  console.log(`[TMDB] Searching for "${query}"`);

  return rateLimitedRequest(async () => {
    const response = await axios.get<{ results: TMDBShow[] }>(
      `${TMDB_BASE_URL}/search/tv`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query,
        },
      }
    );
    return response.data.results;
  });
}
