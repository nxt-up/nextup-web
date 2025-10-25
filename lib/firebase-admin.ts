import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK (singleton pattern)
if (!getApps().length) {
  // Check if we have valid Firebase credentials
  const hasValidCredentials =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PROJECT_ID !== 'your_firebase_project_id' &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL;

  if (hasValidCredentials) {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          // Replace escaped newlines in private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
      // Initialize with empty credentials for build time
      initializeApp();
    }
  } else {
    // Initialize with empty credentials for build time
    console.warn(
      'Firebase credentials not configured. Initializing in mock mode for build.'
    );
    initializeApp();
  }
}

// Get Firestore instance (will be mocked if not properly initialized)
export const db = getFirestore();

// Firestore collections
export const collections = {
  webCache: {
    shows: 'web_cache/shows',
    episodes: 'web_cache/episodes',
    seasons: 'web_cache/seasons',
  },
  users: 'users',
  curatedLists: 'curated_lists',
} as const;
