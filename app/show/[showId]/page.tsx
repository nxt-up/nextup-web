import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getShowDetails, getSeasonDetails } from '@/lib/tmdb';
import {
  getTMDBPosterUrl,
  getTMDBBackdropUrl,
  parseShowSlug,
  createShowSlug,
} from '@/lib/types';

const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com';

type Props = {
  params: Promise<{ showId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { showId: showSlug } = await params;
  const showId = parseShowSlug(showSlug);

  if (!showId) {
    return {
      title: 'Show Not Found - Next Up',
    };
  }

  try {
    const show = await getShowDetails(showId.toString());
    const posterUrl = getTMDBPosterUrl(show.posterPath);

    return {
      title: `${show.name} - Next Up`,
      description: show.overview,
      openGraph: {
        title: show.name,
        description: show.overview,
        images: posterUrl ? [posterUrl] : [],
        type: 'video.tv_show',
      },
      twitter: {
        card: 'summary_large_image',
        title: show.name,
        description: show.overview,
        images: posterUrl ? [posterUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Show Not Found - Next Up',
    };
  }
}

export default async function ShowPage({ params }: Props) {
  const { showId: showSlug } = await params;
  const showId = parseShowSlug(showSlug);

  if (!showId) {
    notFound();
  }

  let show;
  try {
    show = await getShowDetails(showId.toString());
  } catch {
    notFound();
  }

  const posterUrl = getTMDBPosterUrl(show.posterPath);
  const backdropUrl = getTMDBBackdropUrl(show.backdropPath);
  const properSlug = createShowSlug(show.id, show.name);

  // Get current season episodes if available
  let currentSeasonEpisodes = null;
  if (show.numberOfSeasons && show.numberOfSeasons > 0) {
    try {
      const seasonData = await getSeasonDetails(
        showId.toString(),
        show.numberOfSeasons.toString()
      );
      currentSeasonEpisodes = seasonData.episodes || null;
    } catch {
      // Silently fail if season details can't be fetched
    }
  }

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-zinc-950'>
      {/* Backdrop */}
      {backdropUrl && (
        <div className='relative h-64 w-full overflow-hidden sm:h-80'>
          <Image
            src={backdropUrl}
            alt={show.name}
            fill
            className='object-cover opacity-40'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950' />
        </div>
      )}

      <div className='mx-auto max-w-6xl px-6 pb-16'>
        {/* Header Section - Apple Sports Style */}
        <div className='flex flex-col items-center gap-8 py-8 sm:flex-row sm:items-start'>
          {/* Poster */}
          <div className='shrink-0'>
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={show.name}
                width={200}
                height={300}
                className='rounded-2xl shadow-2xl'
                priority
              />
            ) : (
              <div className='h-[300px] w-[200px] rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500' />
            )}
          </div>

          {/* Info */}
          <div className='flex flex-1 flex-col items-center text-center sm:items-start sm:text-left'>
            <h1 className='mb-2 text-4xl font-bold text-zinc-900 dark:text-zinc-50'>
              {show.name}
            </h1>

            {/* Network Logo Placeholder */}
            {show.networks && show.networks.length > 0 && (
              <p className='mb-4 text-sm text-zinc-600 dark:text-zinc-400'>
                {show.networks[0].name}
              </p>
            )}

            {/* Get Button */}
            <a
              href={APP_STORE_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='mb-6 inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-semibold text-white transition-transform hover:scale-105 active:scale-95'
            >
              Get
            </a>

            {/* Metadata */}
            <div className='mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400'>
              {show.status && (
                <>
                  <span>{show.status}</span>
                  <span>•</span>
                </>
              )}
              {show.numberOfSeasons && (
                <>
                  <span>
                    {show.numberOfSeasons}{' '}
                    {show.numberOfSeasons === 1 ? 'Season' : 'Seasons'}
                  </span>
                  <span>•</span>
                </>
              )}
              {show.voteAverage && (
                <span className='flex items-center gap-1'>
                  ⭐ {show.voteAverage.toFixed(1)}
                </span>
              )}
            </div>

            {/* Genres */}
            {show.genres && show.genres.length > 0 && (
              <div className='mb-4 flex flex-wrap gap-2'>
                {show.genres.map(genre => (
                  <span
                    key={genre.id}
                    className='rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className='max-w-2xl text-base leading-7 text-zinc-700 dark:text-zinc-300'>
              {show.overview}
            </p>
          </div>
        </div>

        {/* Current Season Episodes */}
        {currentSeasonEpisodes && currentSeasonEpisodes.length > 0 && (
          <div className='mt-12'>
            <h2 className='mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50'>
              Season {show.numberOfSeasons}
            </h2>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {currentSeasonEpisodes.slice(0, 6).map(episode => (
                <Link
                  key={episode.id}
                  href={`/show/${properSlug}/season/${episode.seasonNumber}/episode/${episode.episodeNumber}`}
                  className='group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900'
                >
                  <div className='p-4'>
                    <div className='mb-2 flex items-start justify-between'>
                      <div className='text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
                        Episode {episode.episodeNumber}
                      </div>
                      {episode.airDate && (
                        <div className='text-xs text-zinc-500 dark:text-zinc-400'>
                          {new Date(episode.airDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <h3 className='mb-2 line-clamp-2 text-base font-medium text-zinc-800 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-50'>
                      {episode.name}
                    </h3>
                    {episode.overview && (
                      <p className='line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400'>
                        {episode.overview}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* View in App CTA */}
        <div className='mt-12 rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900'>
          <h3 className='mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50'>
            Track this show in the app
          </h3>
          <p className='mb-6 text-zinc-600 dark:text-zinc-400'>
            Get notified about new episodes and never miss a moment.
          </p>
          <a
            href={`nextup://show/${show.id}`}
            className='inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-semibold text-white transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black'
          >
            Open in Next Up
          </a>
        </div>

        {/* Back to Home */}
        <div className='mt-8 text-center'>
          <Link
            href='/'
            className='text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
