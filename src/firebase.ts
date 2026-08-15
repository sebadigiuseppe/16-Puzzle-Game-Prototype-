import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  doc,
  setDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ScoreRecord } from './types';

// Initialize Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Sign in with Google Popup
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Sync profile document to Firestore
  if (user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        userId: user.uid,
        displayName: user.displayName || 'Puzzle Player',
        email: user.email || '',
        photoURL: user.photoURL || '',
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not update user profile doc:', e);
    }
  }

  return user;
}

// Sign out
export async function signOutPlayer(): Promise<void> {
  await fbSignOut(auth);
}

// Save game score to Firebase Firestore
export async function saveScoreToCloud(score: ScoreRecord, user?: User | null): Promise<string | null> {
  try {
    const scoresRef = collection(db, 'leaderboard_scores');
    const docRef = await addDoc(scoresRef, {
      ...score,
      userId: user ? user.uid : null,
      photoURL: user?.photoURL || null,
      createdAt: serverTimestamp(),
      syncedToCloud: true,
    });
    return docRef.id;
  } catch (error) {
    console.warn('Failed to save score to cloud Firestore:', error);
    return null;
  }
}

// Fetch top cloud leaderboard scores
export async function fetchCloudLeaderboard(limitCount = 100): Promise<ScoreRecord[]> {
  try {
    const scoresRef = collection(db, 'leaderboard_scores');
    const q = query(scoresRef, orderBy('timeInSeconds', 'asc'), limit(limitCount));
    const snapshot = await getDocs(q);

    const scores: ScoreRecord[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      scores.push({
        id: docSnap.id,
        playerName: data.playerName || 'Anonymous Solver',
        timeInSeconds: data.timeInSeconds || 0,
        moves: data.moves || 0,
        difficulty: data.difficulty || 'medium',
        date: data.date || new Date().toISOString().split('T')[0],
        imageTheme: data.imageTheme || 'Horse Portrait',
        movesPerMinute: data.movesPerMinute || 0,
        rankBadge: data.rankBadge,
        photoURL: data.photoURL,
        userId: data.userId,
      });
    });

    return scores;
  } catch (error) {
    console.warn('Failed to fetch cloud scores:', error);
    return [];
  }
}

export { onAuthStateChanged };
export type { User };
