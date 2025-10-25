import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Next Up',
  description: 'Privacy Policy for the Next Up app',
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div className='prose prose-zinc dark:prose-invert max-w-none'>
          <p className='text-zinc-600 dark:text-zinc-400'>
            Last updated: October 24, 2025
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            1. Information We Collect
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            We collect information that you provide directly to us, including:
          </p>
          <ul className='list-disc pl-6 text-zinc-700 dark:text-zinc-300'>
            <li>Account information (email, username)</li>
            <li>Profile information (display name, avatar)</li>
            <li>TV show preferences and watch history</li>
            <li>Device tokens for push notifications</li>
          </ul>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            2. How We Use Your Information
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            We use the information we collect to:
          </p>
          <ul className='list-disc pl-6 text-zinc-700 dark:text-zinc-300'>
            <li>Provide, maintain, and improve our services</li>
            <li>Send you notifications about new episodes</li>
            <li>Personalize your experience</li>
            <li>Communicate with you about the service</li>
          </ul>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            3. Data Storage
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            Your data is securely stored using Firebase/Firestore. We implement
            appropriate security measures to protect your personal information.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            4. Third-Party Services
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            We use the following third-party services:
          </p>
          <ul className='list-disc pl-6 text-zinc-700 dark:text-zinc-300'>
            <li>
              Firebase (Google) - Authentication, database, and notifications
            </li>
            <li>The Movie Database (TMDB) - TV show data and images</li>
            <li>Apple Sign In - Authentication</li>
          </ul>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            5. Your Privacy Choices
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>You can:</p>
          <ul className='list-disc pl-6 text-zinc-700 dark:text-zinc-300'>
            <li>Make your profile private</li>
            <li>Control who can see your watch history</li>
            <li>Disable push notifications</li>
            <li>Delete your account at any time</li>
          </ul>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            6. Data Deletion
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            You can request deletion of your account and all associated data at
            any time through the app settings.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            7. Children&apos;s Privacy
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            Our service is not directed to children under 13. We do not
            knowingly collect personal information from children under 13.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            8. Changes to This Policy
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new policy on this page.
          </p>

          <h2 className='mt-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
            9. Contact Us
          </h2>
          <p className='text-zinc-700 dark:text-zinc-300'>
            If you have any questions about this Privacy Policy, please contact
            us.
          </p>
        </div>
      </div>
    </div>
  );
}
