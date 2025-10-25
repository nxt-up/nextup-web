import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@/lib/firebase-admin';
import type { User, FollowedShow } from '@/lib/types';
import { getTMDBPosterUrl, createShowSlug } from '@/lib/types';

type Props = {
  params: Promise<{ userId: string }>;
};

async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return null;
    }

    const data = userDoc.data();

    return {
      id: userId,
      email: data?.email,
      username: data?.username,
      fullName: data?.fullName || data?.full_name || data?.displayName,
      avatarURL:
        data?.avatarURL ||
        data?.avatar_url ||
        data?.photoURL ||
        data?.profilePhotoURL,
      isPrivate: data?.isPrivate ?? data?.is_private ?? false,
      watchHistoryVisibility:
        data?.watchHistoryVisibility ||
        data?.watch_history_visibility ||
        'private',
      followerCount: data?.followerCount ?? data?.follower_count,
      followingCount: data?.followingCount ?? data?.following_count,
      createdAt: data?.createdAt || data?.created_at,
    } as User;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
}

async function getUserShows(userId: string): Promise<FollowedShow[]> {
  try {
    const showsSnapshot = await db
      .collection(`users/${userId}/followedShows`)
      .limit(50)
      .get();

    const shows = showsSnapshot.docs.map(doc => {
      const data = doc.data();

      // The document ID is the TMDB show ID
      const showId = parseInt(doc.id, 10);

      // Map field names - Firestore might use different naming
      return {
        showId,
        name: data.name,
        posterPath: data.posterPath || data.poster_path,
        backdropPath: data.backdropPath || data.backdrop_path,
        status: data.status,
        inProduction: data.inProduction ?? data.in_production,
        type: data.type,
        totalSeasons:
          data.totalSeasons ||
          data.total_seasons ||
          data.numberOfSeasons ||
          data.number_of_seasons,
        totalEpisodes:
          data.totalEpisodes ||
          data.total_episodes ||
          data.numberOfEpisodes ||
          data.number_of_episodes,
        followedDate: data.followedDate || data.followed_date,
        lastViewedDate: data.lastViewedDate || data.last_viewed_date,
        notificationsEnabled:
          data.notificationsEnabled ?? data.notifications_enabled,
        nextEpisodeToAir: data.nextEpisodeToAir || data.next_episode_to_air,
        genreIds: data.genreIds || data.genre_ids,
        watchProviderIds: data.watchProviderIds || data.watch_provider_ids,
      } as FollowedShow;
    });

    return shows;
  } catch (error) {
    console.error(`Error fetching shows for user ${userId}:`, error);
    return [];
  }
}

async function getUserStats(
  userId: string
): Promise<{ totalEpisodesWatched?: number }> {
  try {
    const statsDoc = await db
      .collection(`users/${userId}/statistics`)
      .doc('main')
      .get();

    if (!statsDoc.exists) {
      return {};
    }

    const data = statsDoc.data();

    return {
      totalEpisodesWatched:
        data?.totalEpisodesWatched || data?.total_episodes_watched,
    };
  } catch (error) {
    console.error(`Error fetching stats for user ${userId}:`, error);
    return {};
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUserProfile(userId);

  if (!user) {
    return {
      title: 'User Not Found - Next Up',
    };
  }

  const title = user.username
    ? `@${user.username} - Next Up`
    : user.fullName
      ? `${user.fullName} - Next Up`
      : 'User Profile - Next Up';

  return {
    title,
    description: user.isPrivate
      ? 'This profile is private.'
      : `Check out what ${user.username || user.fullName || 'this user'} is watching on Next Up.`,
    openGraph: {
      title,
      type: 'profile',
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { userId } = await params;
  const user = await getUserProfile(userId);

  if (!user) {
    notFound();
  }

  // Check if profile is private
  const isPrivate = user.isPrivate;
  const canViewShows = !isPrivate || user.watchHistoryVisibility === 'everyone';

  let followedShows: FollowedShow[] = [];
  let userStats: { totalEpisodesWatched?: number } = {};

  if (canViewShows) {
    followedShows = await getUserShows(userId);
    userStats = await getUserStats(userId);
  }

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-zinc-950'>
      <div className='mx-auto max-w-6xl px-6 py-16'>
        {/* Header */}
        <div className='mb-12 flex flex-col items-center text-center'>
          {/* Avatar */}
          <div className='mb-6 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl'>
            {user.avatarURL ? (
              <Image
                src={user.avatarURL}
                alt={user.username || user.fullName || 'User'}
                width={128}
                height={128}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-4xl font-bold text-white'>
                {(user.username || user.fullName || '?')[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Name & Username */}
          {user.fullName && (
            <h1 className='mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
              {user.fullName}
            </h1>
          )}
          {user.username && (
            <p className='mb-4 text-lg text-zinc-600 dark:text-zinc-400'>
              @{user.username}
            </p>
          )}

          {/* Stats */}
          <div className='flex gap-8 text-center'>
            <div key='shows'>
              <div className='text-2xl font-bold text-zinc-900 dark:text-zinc-50'>
                {followedShows.length}
              </div>
              <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                Shows
              </div>
            </div>
            {userStats.totalEpisodesWatched !== undefined &&
              userStats.totalEpisodesWatched > 0 && (
                <div key='episodes'>
                  <div className='text-2xl font-bold text-zinc-900 dark:text-zinc-50'>
                    {userStats.totalEpisodesWatched}
                  </div>
                  <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                    Episodes
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Private Profile Message */}
        {isPrivate && (
          <div className='mb-12 rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900'>
            <div className='mb-4 text-6xl'>🔒</div>
            <h2 className='mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
              This profile is private
            </h2>
            <p className='text-zinc-600 dark:text-zinc-400'>
              Follow this user in the app to see their watch activity.
            </p>
          </div>
        )}

        {/* Followed Shows Grid */}
        {canViewShows && followedShows.length > 0 && (
          <div>
            <h2 className='mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50'>
              Currently Watching
            </h2>
            <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
              {followedShows.map(show => {
                const posterUrl = getTMDBPosterUrl(show.posterPath);
                const showSlug = createShowSlug(show.showId, show.name);

                return (
                  <Link
                    key={show.showId}
                    href={`/show/${showSlug}`}
                    className='group'
                  >
                    <div className='mb-3 overflow-hidden rounded-xl shadow-lg transition-transform group-hover:scale-105'>
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={show.name}
                          width={200}
                          height={300}
                          className='h-auto w-full'
                        />
                      ) : (
                        <div className='aspect-[2/3] w-full bg-gradient-to-br from-purple-500 to-pink-500' />
                      )}
                    </div>
                    <h3 className='line-clamp-2 text-sm font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300'>
                      {show.name}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {canViewShows && followedShows.length === 0 && !isPrivate && (
          <div className='rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900'>
            <div className='mb-4 text-6xl'>📺</div>
            <h2 className='mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
              No shows yet
            </h2>
            <p className='text-zinc-600 dark:text-zinc-400'>
              This user hasn&apos;t started tracking any shows yet.
            </p>
          </div>
        )}

        {/* View in App CTA */}
        <div className='mt-12 rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900'>
          <h3 className='mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50'>
            Follow in the app
          </h3>
          <p className='mb-6 text-zinc-600 dark:text-zinc-400'>
            Open Next Up to follow this user and see what they&apos;re watching.
          </p>
          <a
            href={`nextup://user/${userId}`}
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
