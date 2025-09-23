# OAuth/OpenID Connect Implementation Guide for Easy Bites

This guide provides step-by-step instructions for setting up and configuring OAuth/OpenID Connect authentication in the Easy Bites application using Firebase.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Firebase Setup](#firebase-setup)
- [Backend Configuration](#backend-configuration)
- [Frontend Configuration](#frontend-configuration)
- [Testing the Implementation](#testing-the-implementation)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- A Firebase account (https://firebase.google.com/)
- Java 17+ and Maven installed
- Node.js and npm/yarn installed
- Access to the Easy Bites codebase

## Firebase Setup

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Give your project a name (e.g., "easy-bites")

2. **Set up Authentication**:
   - In your Firebase project, go to "Authentication" in the left sidebar
   - Click on "Get started"
   - Go to the "Sign-in method" tab
   - Enable "Google" as a sign-in provider
   - Configure the Google provider with your authorized domains (including localhost for development)
   - Save your changes

3. **Create a Web App**:
   - In your Firebase project, click on the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - In the "Your apps" section, click the "</>" icon to add a web app
   - Register your app with a nickname (e.g., "easy-bites-web")
   - Copy the Firebase configuration object for later use

4. **Generate a Service Account Key**:
   - In "Project settings", go to the "Service accounts" tab
   - Click "Generate new private key"
   - This will download a JSON file containing your service account credentials
   - Keep this file secure and never commit it to version control

5. **Base64 Encode the Service Account Key**:
   - Open a terminal and run the following command:
   ```bash
   base64 -i path/to/your-service-account-key.json
   ```
   - Copy the entire output string for use in the backend configuration

## Backend Configuration

1. **Update Auth Service Properties**:
   - Navigate to `/backend/auth-service/src/main/resources/application.properties`
   - Add or update the Firebase configuration:

   ```properties
   # Firebase Configuration (Base64 encoded service account JSON)
   firebase.credentials.encoded=YOUR_BASE64_ENCODED_SERVICE_ACCOUNT_KEY
   ```
   
   Replace `YOUR_BASE64_ENCODED_SERVICE_ACCOUNT_KEY` with the Base64 encoded string you generated earlier.

2. **Verify Firebase Configuration Class**:
   - Ensure that the `FirebaseConfig.java` class in `com.ds.authservice.config` package is properly configured:

   ```java
   @Configuration
   @Slf4j
   public class FirebaseConfig {

       @Value("${firebase.credentials.encoded}")
       private String firebaseCredentialsEncoded;

       @PostConstruct
       public void initialize() {
           try {
               // Check if Firebase app is already initialized
               if (FirebaseApp.getApps().isEmpty()) {
                   
                   // For development/testing with placeholder
                   if (firebaseCredentialsEncoded == null || 
                       firebaseCredentialsEncoded.isEmpty() || 
                       "FIREBASE_CREDENTIALS_PLACEHOLDER".equals(firebaseCredentialsEncoded)) {
                       log.warn("Firebase credentials not configured properly.");
                       return;
                   }
                   
                   // Decode base64 encoded credentials
                   byte[] decodedCredentials = Base64.getDecoder().decode(firebaseCredentialsEncoded);
                   InputStream credentialsStream = new ByteArrayInputStream(decodedCredentials);
                   
                   // Initialize Firebase with the decoded credentials
                   FirebaseOptions options = FirebaseOptions.builder()
                           .setCredentials(GoogleCredentials.fromStream(credentialsStream))
                           .build();
                   
                   FirebaseApp.initializeApp(options);
                   log.info("Firebase has been initialized successfully");
               }
           } catch (IOException e) {
               log.error("Error initializing Firebase: {}", e.getMessage(), e);
           }
       }
   }
   ```

3. **Verify FirebaseAuthService Implementation**:
   - Ensure the `FirebaseAuthService.java` class has the proper methods for token verification and user creation:

   ```java
   @Service
   @Slf4j
   public class FirebaseAuthService {
       
       // ...existing code...
       
       public LoginResponse verifyFirebaseTokenAndGetUser(String idToken) throws FirebaseAuthException {
           // Verify the Firebase ID token
           FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
           String email = decodedToken.getEmail();
           
           // ...rest of the implementation...
       }
       
       private User createNewFirebaseUser(FirebaseToken token) {
           // Create a new user based on Firebase token data
           // ...implementation details...
       }
   }
   ```

4. **Add Firebase Dependencies**:
   - Ensure the following dependencies are in the `pom.xml` of the auth-service:

   ```xml
   <!-- Firebase Admin SDK -->
   <dependency>
       <groupId>com.google.firebase</groupId>
       <artifactId>firebase-admin</artifactId>
       <version>9.1.1</version>
   </dependency>
   ```

5. **Build the Backend**:
   ```bash
   cd backend
   mvn clean install
   ```

## Frontend Configuration

1. **Create or Update Environment Variables**:
   - Navigate to the `/web-app` directory
   - Create or update the `.env` file with your Firebase configuration:

   ```
   # API and Other Configuration
   VITE_API_URL=http://localhost:8080
   VITE_PUBLIC_SOCKET_URL=http://localhost:8085
   VITE_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
   VITE_ORS_API_KEY=your_ors_api_key_here

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

   Replace the placeholder values with the Firebase configuration values from your Firebase project settings.

2. **Set Up Firebase Initialization**:
   - Ensure the Firebase initialization file at `/web-app/src/lib/firebase.ts` is configured correctly:

   ```typescript
   import { initializeApp } from 'firebase/app'
   import { 
     getAuth, 
     GoogleAuthProvider, 
     signInWithPopup, 
     UserCredential,
     browserPopupRedirectResolver,
     inMemoryPersistence
   } from 'firebase/auth'

   // Firebase configuration
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
   }

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   auth.setPersistence(inMemoryPersistence);

   // Configure Google provider
   const googleProvider = new GoogleAuthProvider();
   googleProvider.addScope('profile');
   googleProvider.addScope('email');
   googleProvider.setCustomParameters({ prompt: 'select_account' });

   /**
    * Sign in with Google
    */
   export const signInWithGoogle = async (): Promise<UserCredential> => {
     try {
       return await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
     } catch (error) {
       console.error("Firebase Google sign-in error:", error);
       throw error;
     }
   }

   export const getFirebaseAuth = () => auth;
   export default app;
   ```

3. **Implement Google OAuth Button Component**:
   - Ensure the Google OAuth button component at `/web-app/src/components/google-oauth-button.tsx` is implemented correctly:

   ```tsx
   import { useState } from 'react'
   import { Button } from '@/components/ui/button.tsx'
   import { toast } from 'sonner'
   import { useAuth } from '@/stores/auth-context.tsx'
   import { useNavigate } from '@tanstack/react-router'
   import { USER_TYPES } from '@/config/user-types.ts'

   export function GoogleOAuthButton() {
     const [isLoading, setIsLoading] = useState(false)
     const navigate = useNavigate()
     const { signInWithGoogleOAuth } = useAuth()

     const handleGoogleSignIn = async () => {
       setIsLoading(true)
       try {
         toast.info('Connecting to Google...', {
           duration: 2000,
           position: 'top-center',
         })
         
         const loggedUser = await signInWithGoogleOAuth()
         
         // Redirect based on role
         if (loggedUser?.role === USER_TYPES.ROLE_CUSTOMER) {
           navigate({ to: '/restaurants' })
         }
       } catch (err: any) {
         console.error('Google login error:', err)
         toast.error(err.message || 'Google login failed', {
           duration: 5000,
           position: 'top-center',
         })
       } finally {
         setIsLoading(false)
       }
     }

     return (
       <Button 
         variant="outline" 
         type="button"
         className="w-full flex items-center justify-center gap-2"
         onClick={handleGoogleSignIn}
         disabled={isLoading}
       >
         {isLoading ? (
           <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-r-transparent" />
         ) : (
           <svg>/* Google icon SVG */</svg>
         )}
         Sign in with Google
       </Button>
     )
   }
   ```

4. **Update Auth Context**:
   - Ensure the auth context at `/web-app/src/stores/auth-context.tsx` includes the Google OAuth sign-in method:

   ```typescript
   // Google OAuth sign in
   const signInWithGoogleOAuth = async () => {
     try {
       // First authenticate with Firebase
       const googleAuthResult = await signInWithGoogle()
       
       // Log the Firebase token for debugging
       console.log('Firebase authentication successful');
       
       // Then authenticate with our backend using the Firebase token
       const data = await authenticateWithFirebase(googleAuthResult)

       // Set user in state and localStorage
       // ...existing implementation...

       return data
     } catch (error: any) {
       console.error("Google OAuth error:", error);
       
       // Clear any partial auth state
       localStorage.removeItem('auth_user')
       localStorage.removeItem('access_token')
       
       throw error;
     }
   }
   ```

5. **Add Firebase Auth Service**:
   - Ensure the Firebase auth service at `/web-app/src/services/firebase-auth-service.ts` is implemented correctly:

   ```typescript
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
    */
   export const authenticateWithFirebase = async (
     firebaseCredential: UserCredential
   ): Promise<FirebaseAuthResponse> => {
     try {
       // Get the Firebase ID token with force refresh
       const idToken = await firebaseCredential.user.getIdToken(true)
       
       // Send the token to our backend
       const response = await axios.post(
         `${BACKEND_BASE_URL}/auth/firebase-login`,
         { idToken },
         { headers: { 'Content-Type': 'application/json' } }
       )

       if (!response.data.success) {
         throw new Error(response.data.message || 'Authentication failed');
       }

       return response.data.result
     } catch (error: any) {
       console.error('Error authenticating with backend:', error);
       throw error;
     }
   }
   ```

6. **Build the Frontend**:
   ```bash
   cd web-app
   npm install
   npm run build
   ```

## Testing the Implementation

1. **Start the Backend Services**:
   ```bash
   cd backend/auth-service
   mvn spring-boot:run
   ```

   Repeat for other required services (api-gateway, etc.)

2. **Start the Frontend**:
   ```bash
   cd web-app
   npm run dev
   ```

3. **Test the Google Sign-In**:
   - Navigate to the login page
   - Click the "Sign in with Google" button
   - Complete the Google authentication flow
   - You should be redirected to the restaurants page if authentication is successful

## Troubleshooting

### Backend Issues

1. **Firebase App Not Initialized**:
   - Error: `FirebaseApp with name [DEFAULT] doesn't exist`
   - Solution: 
     - Verify the `firebase.credentials.encoded` property is correctly set in application.properties
     - Check that the service account key is valid and properly encoded
     - Make sure the Firebase Admin SDK is properly initialized in the FirebaseConfig class

2. **Token Verification Issues**:
   - Error: `Firebase ID token has invalid signature` or `Firebase ID token has expired`
   - Solution:
     - Ensure the token is being passed correctly from frontend to backend
     - Check if the service account key has the proper permissions
     - Verify the token is not expired by using refreshed tokens (`getIdToken(true)`)

### Frontend Issues

1. **Authentication Popup Issues**:
   - Error: `auth/popup-blocked` or `auth/popup-closed-by-user`
   - Solution:
     - Ensure pop-ups are allowed in the browser
     - Use `browserPopupRedirectResolver` for better popup handling
     - Implement proper error handling for these specific error codes

2. **Configuration Issues**:
   - Error: `auth/configuration-error` or `auth/invalid-api-key`
   - Solution:
     - Double-check all Firebase configuration values in the .env file
     - Make sure the authDomain is correctly set (should be `YOUR_PROJECT_ID.firebaseapp.com`)
     - Verify that the API key is valid and not restricted

3. **CORS Issues**:
   - Error: Network errors when calling backend
   - Solution:
     - Ensure the backend has proper CORS configuration
     - Verify that the frontend is calling the correct backend URL
     - Check network requests in browser developer tools for specific error details

---

For additional help or questions, please contact the development team.