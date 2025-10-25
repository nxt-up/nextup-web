import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-white p-8 dark:bg-black'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-4xl font-bold text-zinc-900 dark:text-zinc-50'>
          Next Up - Test Links
        </h1>

        <div className='space-y-8'>
          {/* Popular TV Shows */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
              Popular TV Shows
            </h2>
            <div className='space-y-2'>
              <Link
                href='/show/1396-breaking-bad'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  Breaking Bad
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /show/1396-breaking-bad
                </div>
              </Link>
              <Link
                href='/show/1399-game-of-thrones'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  Game of Thrones
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /show/1399-game-of-thrones
                </div>
              </Link>
              <Link
                href='/show/94605-arcane'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  Arcane
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /show/94605-arcane
                </div>
              </Link>
              <Link
                href='/show/1418-the-big-bang-theory'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  The Big Bang Theory
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /show/1418-the-big-bang-theory
                </div>
              </Link>
              <Link
                href='/show/84958-loki'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  Loki
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /show/84958-loki
                </div>
              </Link>
            </div>
          </section>

          {/* Sample Episodes */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
              Sample Episodes
            </h2>
            <div className='space-y-2'>
              <Link
                href='/show/1396-breaking-bad/season/1/episode/1'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  Breaking Bad - S01E01 - Pilot
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /show/1396-breaking-bad/season/1/episode/1
                </div>
              </Link>
              <Link
                href='/show/1399-game-of-thrones/season/1/episode/1'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  Game of Thrones - S01E01 - Winter Is Coming
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /show/1399-game-of-thrones/season/1/episode/1
                </div>
              </Link>
              <Link
                href='/show/94605-arcane/season/1/episode/1'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  Arcane - S01E01 - Welcome to the Playground
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /show/94605-arcane/season/1/episode/1
                </div>
              </Link>
            </div>
          </section>

          {/* User Profiles */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
              User Profiles
            </h2>
            <div className='space-y-2'>
              <Link
                href='/user/1WlQbf3XhsXjYQLJFapkRq3use32'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  My Profile
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /user/1WlQbf3XhsXjYQLJFapkRq3use32
                </div>
              </Link>
            </div>
          </section>

          {/* Legal Pages */}
          <section>
            <h2 className='mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
              Legal Pages
            </h2>
            <div className='space-y-2'>
              <Link
                href='/terms'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  Terms of Service
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /terms
                </div>
              </Link>
              <Link
                href='/privacy'
                className='block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
              >
                <div className='font-semibold text-zinc-900 dark:text-zinc-50'>
                  Privacy Policy
                </div>
                <div className='text-sm text-zinc-600 dark:text-zinc-400'>
                  /privacy
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
