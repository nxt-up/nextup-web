import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getShowDetails, getEpisodeDetails } from '@/lib/tmdb';
import {
  getTMDBStillUrl,
  getTMDBPosterUrl,
  parseShowSlug,
  createShowSlug,
} from '@/lib/types';

type Props = {
  params: Promise<{
    showId: string;
    seasonNum: string;
    episodeNum: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { showId: showSlug, seasonNum, episodeNum } = await params;
  const showId = parseShowSlug(showSlug);

  if (!showId) {
    return {
      title: 'Episode Not Found - Next Up',
    };
  }

  try {
    const [show, episode] = await Promise.all([
      getShowDetails(showId.toString()),
      getEpisodeDetails(showId.toString(), seasonNum, episodeNum),
    ]);

    const stillUrl = getTMDBStillUrl(episode.stillPath);

    return {
      title: `${episode.name} - ${show.name} S${seasonNum}E${episodeNum} - Next Up`,
      description: episode.overview || `Episode ${episodeNum} of ${show.name}`,
      openGraph: {
        title: `${episode.name} - ${show.name}`,
        description: episode.overview || `Episode ${episodeNum}`,
        images: stillUrl ? [stillUrl] : [],
        type: 'video.episode',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${episode.name} - ${show.name}`,
        description: episode.overview || `Episode ${episodeNum}`,
        images: stillUrl ? [stillUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Episode Not Found - Next Up',
    };
  }
}

export default async function EpisodePage({ params }: Props) {
  const { showId: showSlug, seasonNum, episodeNum } = await params;
  const showId = parseShowSlug(showSlug);

  if (!showId) {
    notFound();
  }

  let show, episode;
  try {
    [show, episode] = await Promise.all([
      getShowDetails(showId.toString()),
      getEpisodeDetails(showId.toString(), seasonNum, episodeNum),
    ]);
  } catch {
    notFound();
  }

  const stillUrl = getTMDBStillUrl(episode.stillPath);
  const posterUrl = getTMDBPosterUrl(show.posterPath);
  const properSlug = createShowSlug(show.id, show.name);

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-zinc-950'>
      <div className='mx-auto max-w-4xl px-6 py-16'>
        {/* Breadcrumb */}
        <div className='mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400'>
          <Link
            href='/'
            className='hover:text-zinc-900 dark:hover:text-zinc-50'
          >
            Home
          </Link>
          <span>→</span>
          <Link
            href={`/show/${properSlug}`}
            className='hover:text-zinc-900 dark:hover:text-zinc-50'
          >
            {show.name}
          </Link>
          <span>→</span>
          <span className='text-zinc-900 dark:text-zinc-50'>
            S{seasonNum}E{episodeNum}
          </span>
        </div>

        {/* Episode Still/Hero */}
        {stillUrl && (
          <div className='relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80'>
            <Image
              src={stillUrl}
              alt={episode.name}
              fill
              className='object-cover'
              priority
            />
          </div>
        )}

        {/* Episode Info */}
        <div className='mb-8'>
          <div className='mb-4 flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400'>
            <span className='rounded-full bg-zinc-200 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'>
              Season {seasonNum} • Episode {episodeNum}
            </span>
            {episode.airDate && (
              <span>{new Date(episode.airDate).toLocaleDateString()}</span>
            )}
            {episode.runtime && <span>{episode.runtime} min</span>}
            {episode.voteAverage && (
              <span className='flex items-center gap-1'>
                ⭐ {episode.voteAverage.toFixed(1)}
              </span>
            )}
          </div>

          <h1 className='mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50'>
            {episode.name}
          </h1>

          {episode.overview && (
            <p className='text-lg leading-8 text-zinc-700 dark:text-zinc-300'>
              {episode.overview}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className='mb-8 flex gap-4'>
          {parseInt(episodeNum) > 1 && (
            <Link
              href={`/show/${properSlug}/season/${seasonNum}/episode/${parseInt(episodeNum) - 1}`}
              className='flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800'
            >
              ← Previous Episode
            </Link>
          )}
          <Link
            href={`/show/${properSlug}/season/${seasonNum}/episode/${parseInt(episodeNum) + 1}`}
            className='flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800'
          >
            Next Episode →
          </Link>
        </div>

        {/* Watch in App CTA */}
        <div className='mb-8 rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900'>
          <h3 className='mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50'>
            Watch this episode
          </h3>
          <p className='mb-6 text-zinc-600 dark:text-zinc-400'>
            Open Next Up to find where to watch and track your progress.
          </p>
          <a
            href={`nextup://show/${show.id}/season/${seasonNum}/episode/${episodeNum}`}
            className='inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-semibold text-white transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black'
          >
            Open in Next Up
          </a>
        </div>

        {/* Show Info Card */}
        <div className='rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900'>
          <Link
            href={`/show/${properSlug}`}
            className='group flex items-center gap-4'
          >
            {posterUrl && (
              <Image
                src={posterUrl}
                alt={show.name}
                width={80}
                height={120}
                className='rounded-lg shadow-md'
              />
            )}
            <div>
              <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                From the series
              </div>
              <h2 className='text-xl font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300'>
                {show.name}
              </h2>
              {show.numberOfSeasons && (
                <div className='mt-1 text-sm text-zinc-600 dark:text-zinc-400'>
                  {show.numberOfSeasons}{' '}
                  {show.numberOfSeasons === 1 ? 'Season' : 'Seasons'} •{' '}
                  {show.status}
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
