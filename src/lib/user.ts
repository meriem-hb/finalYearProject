
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, Timestamp, collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { User as FirebaseAuthUser } from 'firebase/auth';
import type { AppUser } from '@/types';

/**
 * Creates a user profile document in Firestore.
 * @param userAuth The Firebase Auth user object.
 * @param additionalData Any additional data to store, like username.
 */
export const createUserProfileDocument = async (
  userAuth: FirebaseAuthUser,
  additionalData: { username?: string } = {}
): Promise<AppUser | null> => {
  if (!userAuth) return null;

  const userRef = doc(db, 'users', userAuth.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = userAuth;
    const createdAt = new Date().toISOString();
    const username = additionalData.username || displayName || email?.split('@')[0] || 'User';

    const newUserProfile: Partial<AppUser> = {
      uid: userAuth.uid,
      email,
      displayName: displayName || username,
      username,
      photoURL,
      createdAt,
      interests: [], // Initialize with empty interests
    };

    try {
      await setDoc(userRef, { ...newUserProfile, serverTimestamp: serverTimestamp() });
      const docSnap = await getDoc(userRef); // Re-fetch to get the server timestamp resolved
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: (data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt) || new Date().toISOString(),
        } as AppUser;
      }
      return null;

    } catch (error) {
      console.error('Error creating user profile in Firestore:', error);
      return null;
    }
  }
  const existingData = snapshot.data();
  return {
    ...existingData,
     createdAt: (existingData.createdAt instanceof Timestamp ? existingData.createdAt.toDate().toISOString() : existingData.createdAt) || new Date().toISOString(),
  } as AppUser;
};

/**
 * Retrieves a user profile document from Firestore.
 * @param uid The user's UID.
 * @returns The user profile data or null if not found.
 */
export const getUserProfileDocument = async (uid: string): Promise<AppUser | null> => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
     const data = snapshot.data();
    return {
      ...data,
      createdAt: (data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt) || new Date().toISOString(),
    } as AppUser;
  } else {
    console.log('No such user profile!');
    return null;
  }
};

/**
 * Updates the interests for a user in Firestore.
 * @param uid The user's UID.
 * @param interests An array of interest strings.
 */
export const updateUserInterests = async (uid: string, interests: string[]): Promise<boolean> => {
  if (!uid) return false;
  const userRef = doc(db, 'users', uid);
  try {
    await updateDoc(userRef, { interests });
    return true;
  } catch (error) {
    console.error('Error updating user interests:', error);
    return false;
  }
};

/**
 * Fetches all user profiles from Firestore.
 * @returns {Promise<AppUser[]>} An array of user profiles.
 */
export async function getAllUserProfiles(): Promise<AppUser[]> {
  try {
    const usersCol = collection(db, 'users');
    // Consider adding orderBy if you want a specific order, e.g., by username or createdAt
    const q = query(usersCol, orderBy('displayName')); 
    const querySnapshot = await getDocs(q);

    const users: AppUser[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        email: data.email,
        displayName: data.displayName,
        username: data.username,
        photoURL: data.photoURL,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        interests: data.interests || [],
      });
    });
    return users;
  } catch (error) {
    console.error("Error fetching all user profiles from Firestore: ", error);
    return [];
  }
}
