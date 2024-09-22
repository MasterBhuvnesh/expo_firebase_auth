// Import the necessary functions and modules for Firebase
import { initializeApp } from "firebase/app"; // Import the function to initialize the Firebase app
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // Import Firebase authentication functions
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage to persist authentication data

/*  
  apiKey  -- >// The API key to authenticate requests to Firebase services
  authDomain  -- >// The domain name for Firebase Authentication
  projectId  -- > // The unique identifier for your Firebase project
  storageBucket  -- > // The URL of your project's default storage bucket
  messagingSenderId  -- > // The sender ID used for cloud messaging
  appId  -- > // The unique identifier for the Firebase app instance
  */
// Initialize Firebase with environment variables , Firebase configuration object containing the project-specific Firebase keys
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};
// Initialize the Firebase app with the provided config
const app = initializeApp(firebaseConfig);
// This function initializes your Firebase app using the `firebaseConfig` object, allowing you to access Firebase services (e.g., Authentication, Firestore).

// Initialize Firebase Authentication with persistence using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
  // `getReactNativePersistence(AsyncStorage)` ensures that the authentication state is stored in `AsyncStorage`,
  // allowing it to persist across app restarts and sessions.
});

// Export the `auth` object so it can be used throughout the app for authentication functions (e.g., sign-in, sign-out)
export { auth };
