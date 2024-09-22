# Expo Firebase Authentication App

This project is a simple authentication app built using **React Native** and **Firebase** in an Expo environment. The app allows users to log in, register, and reset their password using Firebase Authentication.

## Features

- User login with email and password
- User registration with email and password
- Password reset via email
- Email validation using the Abstract API before login or registration

## Installation

1. **Clone the repository:**

```bash
   git clone https://github.com/your-username/expo_firebase_auth.git
   cd expo_firebase_auth
```

2. **Install the required dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file for environment variables (add Firebase keys):**

```bash
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
API_URL_KEY=your_emailvalidation_apikey
```

4. **Run the app:**

```bash
npx expo start
```

## Modules Used

1. **React Navigation** (`@react-navigation/native`, `@react-navigation/core`)

   Provides navigation functionality to move between different screens in the app.

   `useNavigation:` A hook from React Navigation to navigate between different screens programmatically.

   ```javascript
   import { useNavigation } from "@react-navigation/core";
   ```

2. **Firebase** (`firebase/app`, `firebase/auth`)

Firebase Authentication provides backend services for user authentication, including login, registration, and password reset.

```javascript
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
```

Key Firebase Authentication Methods

- `signInWithEmailAndPassword(auth, email, password)` - Logs in an existing user with their email and password. It returns a user object if successful.

- `createUserWithEmailAndPassword(auth, email, password)` - Registers a new user with their email and password. This will create a new user in the Firebase Auth system and return the user object upon success.

- `sendPasswordResetEmail(auth, email)` - Sends an email to the user with instructions to reset their password. This is useful when users forget their login credentials.

3. **Abstract API** (`fetch`)
   Abstract API is used for email validation before login or registration. It helps verify that the email entered by the user is deliverable and correctly formatted.

```javascript
const validateEmail = async (email) => {
  const response = await fetch(
    `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
  );
  const data = await response.json();
  return data.is_valid_format.value && data.deliverability === "DELIVERABLE";
};
```

4. **React Native Core Components**

- `KeyboardAvoidingView`: Helps the UI adjust when the keyboard appears, avoiding overlap.
- `TextInput`: Allows users to enter text (for email and password inputs).
- `TouchableOpacity`: Provides touchable elements (buttons) with opacity on press.
- `View`, `Text`, `StyleSheet`: Basic layout and styling components in React Native.

5. **React Native AsyncStorage** (`@react-native-async-storage/async-storage`)

Used for storing authentication persistence locally in the app. Firebase Auth is initialized with persistence support so that the user remains logged in across app restarts.

```javascript
import AsyncStorage from "@react-native-async-storage/async-storage";
```

6. **Firebase Configuration**

Firebase is initialized with the following code in `firebase.js`:

```javascript
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence support
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
```

## Conclusion

This app is a basic implementation of Firebase Authentication with React Native using Expo. It covers core authentication features such as login, registration, and password reset, along with email validation using the Abstract API.

`Feel free to make any additional changes or let me know if you need further modifications!`
