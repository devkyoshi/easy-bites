import { UserCredential } from 'firebase/auth'
import axios from 'axios'
import { BACKEND_BASE_URL } from '@/config/app.ts'

interface FirebaseAuthResponse {
  userId: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  accessToken: string
}

/**
 * Authenticate with the backend using a Firebase ID token
 * @param firebaseCredential Firebase UserCredential received after OAuth authentication
 * @returns Response with user info and JWT token from our backend
 */
export const authenticateWithFirebase = async (
  firebaseCredential: UserCredential
): Promise<FirebaseAuthResponse> => {
  try {
    // Get the Firebase ID token
    const idToken = await firebaseCredential.user.getIdToken(true) // Force refresh the token
    
    console.log('Sending Firebase token to backend...');
    
    // Send the token to our backend
    const response = await axios.post(
      `${BACKEND_BASE_URL}/auth/firebase-login`,
      { idToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('Backend response:', response.status);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Authentication failed');
    }

    return response.data.result;
  } catch (error: any) {
    console.error('Error authenticating with backend:', error);
    
    // Enhance error message with details from the backend if available
    if (error.response?.data?.message) {
      throw new Error(`Backend authentication error: ${error.response.data.message}`);
    }
    
    throw error;
  }
}