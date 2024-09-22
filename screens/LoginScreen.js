// Import necessary libraries and components
import { useNavigation } from "@react-navigation/core"; // Navigation hook to navigate between screens
import React, { useEffect, useState } from "react"; // React for building components and hooks
import {
  KeyboardAvoidingView, // Component to adjust the keyboard appearance
  StyleSheet, // Stylesheet for styling components
  Text, // Text component for displaying text
  TextInput, // Input component for user text input
  TouchableOpacity, // Touchable component for pressable buttons
  View, // Basic container component
} from "react-native"; // React Native core components
import { auth } from "../firebase"; // Firebase authentication instance
import {
  signInWithEmailAndPassword, // Function for signing in users
  createUserWithEmailAndPassword, // Function for registering new users
  sendPasswordResetEmail, // Function to send password reset email
} from "firebase/auth"; // Firebase authentication methods

// Function to validate email format and deliverability using Abstract API
const validateEmail = async (email) => {
  try {
    // Fetch email validation data from the API
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );

    const data = await response.json(); // Convert the response to JSON

    // Destructure the properties from the response
    const { is_valid_format, deliverability } = data;
    // Return true if the email is in valid format and deliverable
    return is_valid_format.value && deliverability === "DELIVERABLE";
  } catch (error) {
    // Log any error during the fetch
    console.error("Email validation error:", error);
    return false; // Return false if there's an error
  }
};

// Main functional component for the Login Screen
const LoginScreen = () => {
  // State variables for email and password inputs
  const [email, setEmail] = useState(""); // Initialize email state
  const [password, setPassword] = useState(""); // Initialize password state

  const navigation = useNavigation(); // Hook to access the navigation object

  // Effect to check authentication state
  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // If a user is logged in, navigate to the Home screen
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe; // Cleanup function to unsubscribe when component unmounts
  }, []);

  // Function to handle user registration
  const handleSignUp = async () => {
    // Check if email or password is empty
    if (!email || !password) {
      alert("Please enter both email and password."); // Alert user if empty
      return; // Exit function
    }

    // Validate email before registration
    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
      alert("Please enter a valid email address."); // Alert if email is invalid
      return; // Exit function
    }

    // Attempt to create a new user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user; // Get the user object
        console.log("Registered with:", user.email); // Log successful registration
      })
      .catch((error) => {
        // Handle specific registration errors
        if (error.code === "auth/email-already-in-use") {
          alert("This email is already in use."); // Alert if email is already in use
        } else {
          alert(error.message); // Alert for other errors
        }
      });
  };

  // Function to handle user login
  const handleLogin = async () => {
    // Check if email or password is empty
    if (!email || !password) {
      alert("Please enter both email and password."); // Alert user if empty
      return; // Exit function
    }

    // Validate email before login
    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
      alert("Please enter a valid email address."); // Alert if email is invalid
      return; // Exit function
    }

    // Attempt to sign in the user
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user; // Get the user object
        console.log("Logged in with:", user.email); // Log successful login
      })
      .catch((error) => {
        // Handle specific login errors
        if (error.code === "auth/user-not-found") {
          alert("No user found with this email."); // Alert if no user found
        } else if (error.code === "auth/wrong-password") {
          alert("Incorrect password."); // Alert if password is incorrect
        } else {
          alert("Invalid credentials. Please check your email and password."); // Alert for other errors
        }
      });
  };

  // Function to handle password reset
  const handleForgotPassword = async () => {
    // Check if email is empty
    if (!email) {
      alert("Please enter your email."); // Alert user if empty
      return; // Exit function
    }

    // Validate email before sending reset link
    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
      alert("Please enter a valid email address."); // Alert if email is invalid
      return; // Exit function
    }

    // Attempt to send password reset email
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!"); // Alert on success
      })
      .catch((error) => alert(error.message)); // Alert on error
  };

  // Render the login screen components
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email" // Placeholder text for email input
          value={email} // Controlled input value
          onChangeText={(text) => setEmail(text)} // Update email state on change
          style={styles.input} // Apply styles
        />
        <TextInput
          placeholder="Password" // Placeholder text for password input
          value={password} // Controlled input value
          onChangeText={(text) => setPassword(text)} // Update password state on change
          style={styles.input} // Apply styles
          secureTextEntry // Mask password input
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp} // Trigger sign-up on press
          style={[styles.button, styles.buttonOutline]} // Apply styles for outline button
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// Export the LoginScreen component
export default LoginScreen;

// Define styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the entire screen
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  inputContainer: {
    width: "80%", // Set width to 80% of the parent
  },
  input: {
    backgroundColor: "white", // Set input background color
    paddingHorizontal: 15, // Horizontal padding inside input
    paddingVertical: 10, // Vertical padding inside input
    borderRadius: 10, // Rounded corners for input
    marginTop: 5, // Space above the input
  },
  buttonContainer: {
    width: "60%", // Set button container width
    justifyContent: "center", // Center buttons vertically
    alignItems: "center", // Center buttons horizontally
    marginTop: 40, // Space above the button container
  },
  button: {
    backgroundColor: "#0782F9", // Set button background color
    width: "100%", // Full width button
    padding: 15, // Padding inside button
    borderRadius: 10, // Rounded corners for button
    alignItems: "center", // Center button text
  },
  buttonOutline: {
    backgroundColor: "white", // Outline button background color
    marginTop: 5, // Space above the outline button
    borderColor: "#0782F9", // Border color for outline button
    borderWidth: 2, // Border width for outline button
  },
  buttonText: {
    color: "white", // Text color for button
    fontWeight: "700", // Bold text
    fontSize: 16, // Font size for button text
  },
  buttonOutlineText: {
    color: "#0782F9", // Text color for outline button
    fontWeight: "700", // Bold text
    fontSize: 16, // Font size for outline button text
  },
  forgotPassword: {
    color: "#0782F9", // Color for the forgot password text
    marginTop: 20, // Space above the forgot password text
    textDecorationLine: "underline", // Underline the text
  },
});
