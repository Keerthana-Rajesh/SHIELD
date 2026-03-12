import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase project config (replace with your actual values from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyExample_ReplaceWithYourKey",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:abc123",
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export { storage };
export default app;
