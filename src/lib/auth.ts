
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseAuthUser,
  type AuthError,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfileDocument, getUserProfileDocument } from './user';
import type { AppUser } from '@/types';

export { type FirebaseAuthUser };

const googleProvider = new GoogleAuthProvider();

interface AuthResult {
  user: AppUser | null;
  error: string | null;
}

export const getFirebaseAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'البريد الإلكتروني الذي أدخلته غير صالح.';
    case 'auth/user-disabled':
      return 'تم تعطيل هذا الحساب.';
    case 'auth/user-not-found':
      return 'لم يتم العثور على حساب بهذا البريد الإلكتروني.';
    case 'auth/wrong-password':
      return 'كلمة المرور غير صحيحة.';
    case 'auth/email-already-in-use':
      return 'هذا البريد الإلكتروني مُستخدم بالفعل.';
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة جدًا. يجب أن تتكون من 6 أحرف على الأقل.';
    case 'auth/operation-not-allowed':
      return 'تسجيل الدخول بكلمة المرور معطل لهذا المشروع.';
    case 'auth/popup-closed-by-user':
      return 'تم إغلاق نافذة تسجيل الدخول بواسطة جوجل.';
    case 'auth/cancelled-popup-request':
      return 'تم إلغاء طلب نافذة تسجيل الدخول بواسطة جوجل.';
    case 'auth/account-exists-with-different-credential':
      return 'يوجد حساب بالفعل بنفس عنوان البريد الإلكتروني ولكن ببيانات اعتماد تسجيل دخول مختلفة.';
    default:
      return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
  }
};


export const signUpWithEmail = async (email: string, password: string, username: string): Promise<AuthResult> => {
  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    const userProfile = await createUserProfileDocument(firebaseUser, { username });
    return { user: userProfile, error: null };
  } catch (e) {
    const error = e as AuthError;
    console.error('Error signing up with email and password', error);
    return { user: null, error: getFirebaseAuthErrorMessage(error.code) };
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    const userProfile = await getUserProfileDocument(firebaseUser.uid);
    return { user: userProfile, error: null };
  } catch (e) {
    const error = e as AuthError;
    console.error('Error signing in with email and password', error);
    return { user: null, error: getFirebaseAuthErrorMessage(error.code) };
  }
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);
    // Check if user profile exists, create if not
    let userProfile = await getUserProfileDocument(firebaseUser.uid);
    if (!userProfile) {
      userProfile = await createUserProfileDocument(firebaseUser);
    }
    return { user: userProfile, error: null };
  } catch (e) {
    const error = e as AuthError;
    console.error('Error signing in with Google', error);
    return { user: null, error: getFirebaseAuthErrorMessage(error.code) };
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
  }
};

/**
 * Listens to Firebase Auth state changes and fetches the user's profile from Firestore.
 * @param callback Function to call with the AppUser object or null.
 * @returns Unsubscribe function.
 */
export const onAuthUserProfileChanged = (callback: (user: AppUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
    if (firebaseUser) {
      const userProfile = await getUserProfileDocument(firebaseUser.uid);
      if (userProfile) {
        // Combine auth data (like emailVerified, phoneNumber if needed) with Firestore profile
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: userProfile.displayName || firebaseUser.displayName,
          username: userProfile.username,
          photoURL: userProfile.photoURL || firebaseUser.photoURL,
          createdAt: userProfile.createdAt,
          interests: userProfile.interests || [],
        });
      } else {
        // This case might happen if Firestore profile creation failed or is delayed.
        // For robustness, you could attempt to create it here or log an issue.
        // For now, return a basic AppUser from auth data.
        console.warn(`Firestore profile not found for user ${firebaseUser.uid}. Attempting to create.`);
        const newProfile = await createUserProfileDocument(firebaseUser);
        callback(newProfile);
      }
    } else {
      callback(null);
    }
  });
};

// This function provides the raw Firebase Auth user object, useful for some client-side checks
// or if you don't need the full Firestore profile immediately.
export const getCurrentUser = (): FirebaseAuthUser | null => {
  return auth.currentUser;
};
