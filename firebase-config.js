import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Replace with your Firebase Project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Complexity numeric map for sorting
const COMPLEXITY_WEIGHTS = {
  "O(1)": 1,
  "O(log N)": 2,
  "O(N)": 3,
  "O(N log N)": 4,
  "O(N^2)": 5,
  "O(2^N)": 6
};

/**
 * Submits a test result to the Firebase Leaderboard
 */
export async function submitScore(taskId, username, complexityInfo, avgRuntimeMs) {
  if (!username || username.trim() === "") {
    username = "匿名"; // Fallback to "Anonymous" in Japanese
  }

  const timeComplexity = complexityInfo.time_complexity || "O(N^2)";
  const spaceComplexity = complexityInfo.space_complexity || "O(N)";
  const complexityRank = COMPLEXITY_WEIGHTS[timeComplexity] || 99;

  try {
    await addDoc(collection(db, "leaderboards"), {
      taskId: taskId,
      username: username.trim(),
      timeComplexity: timeComplexity,
      spaceComplexity: spaceComplexity,
      complexityRank: complexityRank,
      avgRuntimeMs: avgRuntimeMs,
      timestamp: new Date()
    });
    console.log("Score successfully submitted to Firebase!");
  } catch (error) {
    console.error("Error submitting score to Firebase:", error);
  }
}

/**
 * Listens for real-time Leaderboard updates for a given task
 */
export function listenToLeaderboard(taskId, renderCallback) {
  const q = query(
    collection(db, "leaderboards"),
    where("taskId", "==", taskId),
    orderBy("complexityRank", "asc"),
    orderBy("avgRuntimeMs", "asc"),
    limit(10)
  );

  // Subscribe to real-time updates
  return onSnapshot(q, (snapshot) => {
    const scores = [];
    snapshot.forEach((doc) => {
      scores.push(doc.data());
    });
    renderCallback(scores);
  });
}