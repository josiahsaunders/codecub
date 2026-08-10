// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  addDoc, 
  query, 
  where,
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdWt9pbsEpwDwW2qxs-ljHp_copOYvYlI",
  authDomain: "codecub-47802.firebaseapp.com",
  projectId: "codecub-47802",
  storageBucket: "codecub-47802.firebasestorage.app",
  messagingSenderId: "187669573443",
  appId: "1:187669573443:web:7444e0cbb1706d5d35c9f6",
  measurementId: "G-ZM8N1K5CFW"
};

// 2. Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 3. Rank Maps for Sorting (Lower number = better algorithm)
const TIME_RANKS = {
  "O(1)": 1,
  "O(log N)": 2,
  "O(N)": 3,
  "O(N log N)": 4,
  "O(N^2)": 5,
  "O(2^N)": 6
};

const SPACE_RANKS = {
  "O(1)": 1,
  "O(log N)": 2,
  "O(N)": 3
};

export async function processLeaderboardSubmission(username, taskId, newResult) {
  if (!db) return;

  try {
    // 1. ALWAYS write an entry to the complete history log
    await addDoc(collection(db, "submission_history"), {
      taskId: taskId,
      username: username,
      timeComplexity: newResult.timeComplexity,
      spaceComplexity: newResult.spaceComplexity,
      totalRuntimeMs: newResult.totalRuntimeMs,
      peakMemoryMb: newResult.peakMemoryMb,
      allPassed: newResult.allPassed,
      timestamp: new Date()
    });

    // 2. ALSO update the Personal Best in leaderboard_submissions (existing logic)
    const docId = `${taskId}_${username}`;
    const userRef = doc(db, "leaderboard_submissions", docId);
    const snap = await getDoc(userRef);
    const existingData = snap.exists() ? snap.data() : null;

    const newTimeRank = TIME_RANKS[newResult.timeComplexity] || 99;
    const newSpaceRank = SPACE_RANKS[newResult.spaceComplexity] || 99;

    let updates = {
      taskId: taskId,
      username: username,
      updatedAt: new Date()
    };

    // --- Time Record Check ---
    let isBetterTime = !existingData || !existingData.timeRecord;
    if (existingData?.timeRecord) {
      const old = existingData.timeRecord;
      if (newTimeRank < old.complexityRank) isBetterTime = true;
      else if (newTimeRank === old.complexityRank && newResult.totalRuntimeMs < old.totalRuntimeMs) isBetterTime = true;
    }

    if (isBetterTime) {
      updates.timeRecord = {
        complexity: newResult.timeComplexity,
        complexityRank: newTimeRank,
        totalRuntimeMs: newResult.totalRuntimeMs
      };
    } else if (existingData?.timeRecord) {
      updates.timeRecord = existingData.timeRecord;
    }

    // --- Memory Record Check ---
    let isBetterMemory = !existingData || !existingData.memoryRecord;
    if (existingData?.memoryRecord) {
      const old = existingData.memoryRecord;
      if (newSpaceRank < old.complexityRank) isBetterMemory = true;
      else if (newSpaceRank === old.complexityRank && newResult.peakMemoryMb < old.peakMemoryMb) isBetterMemory = true;
    }

    if (isBetterMemory) {
      updates.memoryRecord = {
        complexity: newResult.spaceComplexity,
        complexityRank: newSpaceRank,
        peakMemoryMb: newResult.peakMemoryMb
      };
    } else if (existingData?.memoryRecord) {
      updates.memoryRecord = existingData.memoryRecord;
    }

    if (isBetterTime || isBetterMemory || !snap.exists()) {
      await setDoc(userRef, updates, { merge: true });
    }
  } catch (err) {
    console.error("Error submitting to Firebase:", err);
  }
}

/**
 * Replaces `listenToLeaderboard`: Fetches all entries for a task.
 */
export async function fetchTaskLeaderboard(taskId) {
  if (!db) return [];

  try {
    const q = query(
      collection(db, "leaderboard_submissions"),
      where("taskId", "==", taskId)
    );

    const querySnapshot = await getDocs(q);
    const entries = [];

    querySnapshot.forEach((doc) => {
      entries.push(doc.data());
    });

    return entries;
  } catch (err) {
    console.error("Error fetching leaderboard entries:", err);
    return [];
  }
}

/**
 * Fetches the full submission history list for a specific user and task
 */
export async function fetchUserSubmissionHistory(taskId, username) {
  if (!db) return [];

  try {
    const q = query(
      collection(db, "submission_history"),
      where("taskId", "==", taskId),
      where("username", "==", username)
    );

    const snapshot = await getDocs(q);
    const history = [];

    snapshot.forEach((doc) => {
      history.push(doc.data());
    });

    // Sort descending by timestamp (newest attempt first)
    return history.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
  } catch (err) {
    console.error("Error fetching submission history:", err);
    return [];
  }
}