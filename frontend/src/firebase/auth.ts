import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth } from './config';
import { createUserProfile, getUserProfile } from './services';

export async function registerWithEmail(email: string, password: string): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(userCredential.user.uid, email);
  return userCredential;
}

export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  return await signOut(auth);
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function initializeUserSession(firebaseUser: FirebaseUser) {
  let userData = await getUserProfile(firebaseUser.uid);

  if (!userData) {
    userData = await createUserProfile(firebaseUser.uid, firebaseUser.email || '');
  }

  return userData;
}
