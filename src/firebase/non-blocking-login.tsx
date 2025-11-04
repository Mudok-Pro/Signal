'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

// Function to create a user profile document
const createUserProfile = async (user: User) => {
  const db = getFirestore(user.app);
  const userProfileRef = doc(db, "users", user.uid);
  try {
    await setDoc(userProfileRef, {
      id: user.uid,
      email: user.email,
      name: user.displayName,
      role: 'client', // Default role
    }, { merge: true });
  } catch (error) {
    console.error("Error creating user profile:", error);
    // Handle error appropriately, maybe emit a global error
  }
};


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).then(({ user }) => {
    createUserProfile(user);
  }).catch(error => {
    console.error("Anonymous sign-in failed:", error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password)
  .then(({ user }) => {
    createUserProfile(user);
  }).catch(error => {
    console.error("Email sign-up failed:", error);
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // Sign-in doesn't need to create a profile, it should already exist.
  signInWithEmailAndPassword(authInstance, email, password).catch(error => {
     console.error("Email sign-in failed:", error);
  });
}
