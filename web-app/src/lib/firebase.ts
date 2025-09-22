import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  UserCredential,
  browserPopupRedirectResolver,
  inMemoryPersistence
} from 'firebase/auth'


// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'FIREBASE_API_KEY_PLACEHOLDER',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'FIREBASE_AUTH_DOMAIN_PLACEHOLDER',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'FIREBASE_PROJECT_ID_PLACEHOLDER',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'FIREBASE_STORAGE_BUCKET_PLACEHOLDER',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'FIREBASE_APP_ID_PLACEHOLDER',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get auth instance and configure it
const auth = getAuth(app);
auth.setPersistence(inMemoryPersistence); // Use in-memory persistence to avoid issues with cookies

// Create and configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in with Google using Firebase Authentication
 * @returns UserCredential object from Firebase
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    console.log('Starting Google sign-in process...');
    
    // Use explicit resolver to help with popup issues
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    
    // Log success
    console.log('Google sign-in successful');
    
    return result;
  } catch (error: any) {
    console.error("Firebase Google sign-in error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // If there's an error with the auth domain, log additional information
    if (error.code === 'auth/invalid-oauth-provider' || error.code === 'auth/configuration-error') {
      console.error("Firebase config issue. Check your auth domain and project settings.");
      console.error("Current config:", JSON.stringify(firebaseConfig, null, 2));
    }
    
    throw error;
  }
}

/**
 * Get the current Firebase auth instance
 */
export const getFirebaseAuth = () => auth

export default app