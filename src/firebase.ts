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
import { ScoreRecord, CommunityPetPicture } from './types';

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

// Save game score to Firebase Firestore (preventing duplicates)
export async function saveScoreToCloud(score: ScoreRecord, user?: User | null): Promise<string | null> {
  try {
    // Generate a deterministic doc ID for the score record if possible to prevent duplicates
    const safeDocId = score.id.startsWith('score-')
      ? `${user?.uid || score.playerName.replace(/\s+/g, '_')}_${score.difficulty}_${Math.round(score.timeInSeconds * 10)}_${score.moves}_${score.date}`
      : score.id;

    const scoreDocRef = doc(db, 'leaderboard_scores', safeDocId);
    await setDoc(scoreDocRef, {
      ...score,
      id: safeDocId,
      userId: user ? user.uid : null,
      photoURL: user?.photoURL || null,
      createdAt: serverTimestamp(),
      syncedToCloud: true,
    }, { merge: true });

    return safeDocId;
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

// Save Community Pet Picture to Firestore
export async function saveCommunityPictureToCloud(pet: CommunityPetPicture, user?: User | null): Promise<string | null> {
  try {
    const docRef = doc(db, 'community_pictures', pet.id);
    await setDoc(docRef, {
      ...pet,
      authorUid: user ? user.uid : (pet.authorUid || null),
      createdAt: pet.createdAt || new Date().toISOString(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return pet.id;
  } catch (error) {
    console.warn('Failed to save pet picture to cloud:', error);
    return null;
  }
}

// Fetch Approved Community Pet Pictures from Firestore
export async function fetchCloudCommunityPictures(limitCount = 60): Promise<CommunityPetPicture[]> {
  try {
    const petsRef = collection(db, 'community_pictures');
    const q = query(petsRef, limit(limitCount));
    const snapshot = await getDocs(q);

    const pets: CommunityPetPicture[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.status === 'approved' || !data.status) {
        pets.push({
          id: docSnap.id,
          petName: data.petName || 'Cute Pet',
          animalType: data.animalType || 'Animal Companion',
          description: data.description || '',
          location: data.location || '',
          submitterName: data.submitterName || 'Community Member',
          authorUid: data.authorUid || null,
          imageUrl: data.imageUrl || '',
          qualityScore: data.qualityScore || 9,
          aiComment: data.aiComment || 'Approved for puzzle challenge.',
          status: 'approved',
          createdAt: data.createdAt || new Date().toISOString(),
          timesUsedAsDaily: data.timesUsedAsDaily || 0,
          lastUsedDate: data.lastUsedDate || null,
          usedDates: data.usedDates || [],
          isPreset: data.isPreset || false,
        });
      }
    });

    return pets;
  } catch (error) {
    console.warn('Failed to fetch cloud community pictures:', error);
    return [];
  }
}

// Update Community Picture Usage in Firestore
export async function updateCloudPictureUsage(pictureId: string, lastUsedDate: string, timesUsed: number): Promise<void> {
  try {
    const docRef = doc(db, 'community_pictures', pictureId);
    await setDoc(docRef, {
      lastUsedDate,
      timesUsedAsDaily: timesUsed,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('Could not update cloud picture usage:', e);
  }
}

export { onAuthStateChanged };
export type { User };

