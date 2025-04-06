import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  User,
  UserCredential,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// User types
export type UserRole = 'admin' | 'ngo' | 'donor' | 'volunteer' | 'beneficiary';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  profileComplete: boolean;
}

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole = 'donor'
): Promise<UserData> => {
  try {
    // Create user account
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Prepare user data for Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName,
      photoURL: user.photoURL || '',
      role,
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: false,
      profileComplete: false
    };
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return userData;
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw new Error(error.message);
  }
};

// Sign in existing user
export const signInUser = async (email: string, password: string): Promise<UserData> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login timestamp
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      lastLogin: serverTimestamp()
    });
    
    // Get user data from Firestore
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      throw new Error('User data not found');
    }
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message);
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error resetting password:', error);
    throw new Error(error.message);
  }
};

// Update user profile
export const updateUserProfile = async (
  user: User,
  data: { displayName?: string; photoURL?: string }
): Promise<void> => {
  try {
    await updateProfile(user, data);
    
    // Update Firestore data
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, data);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(error.message);
  }
};

// Update user email
export const updateUserEmail = async (user: User, newEmail: string): Promise<void> => {
  try {
    await updateEmail(user, newEmail);
    
    // Update Firestore data
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { email: newEmail });
  } catch (error: any) {
    console.error('Error updating email:', error);
    throw new Error(error.message);
  }
};

// Update user password
export const updateUserPassword = async (user: User, newPassword: string): Promise<void> => {
  try {
    await updatePassword(user, newPassword);
  } catch (error: any) {
    console.error('Error updating password:', error);
    throw new Error(error.message);
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting user data:', error);
    throw new Error(error.message);
  }
};

// Listen to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 