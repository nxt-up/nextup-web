import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Next Up',
  description: 'Terms of Service for the Next Up app',
};

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-white dark:bg-black'>
      <div className='mx-auto max-w-3xl px-6 py-16'>
        <Link
          href='/'
          className='mb-8 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
        >
          ← Back to Home
        </Link>

        <h1 className='mb-8 text-4xl font-bold text-zinc-900 dark:text-zinc-50'>
          Terms of Service
        </h1>

        <div className='prose prose-zinc dark:prose-invert max-w-none'>
          <p className='text-zinc-600 dark:text-zinc-400'>
            Last updated: October 24, 2025
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            1. Acceptance of Terms
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            By accessing and using Next Up, you accept and agree to be bound by
            the terms and provision of this agreement.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            2. Use License
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            Permission is granted to temporarily download one copy of Next Up
            per device for personal, non-commercial transitory viewing only.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            3. User Account
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            You are responsible for safeguarding the password that you use to
            access the Service and for any activities or actions under your
            password.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            4. Content
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            All show data is provided by The Movie Database (TMDB). Next Up is
            not affiliated with or endorsed by TMDB.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            5. Disclaimer
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            The materials in Next Up are provided on an &apos;as is&apos; basis.
            Next Up makes no warranties, expressed or implied, and hereby
            disclaims and negates all other warranties.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            6. Limitations
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            In no event shall Next Up or its suppliers be liable for any damages
            arising out of the use or inability to use Next Up.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            7. Contact
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            If you have any questions about these Terms, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
