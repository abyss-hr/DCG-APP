// src/firebase/firebaseConfig.ts
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const extra = (Constants.expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {}) as Record<
  string,
  unknown
>;

const requireExtraString = (key: string) => {
  const value = extra[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Missing Expo config extra: ${key}. Configure it via app.config.js and env vars.`
    );
  }
  return value;
};

const firebaseConfig = {
  apiKey: requireExtraString("firebaseApiKey"),
  authDomain: requireExtraString("firebaseAuthDomain"),
  projectId: requireExtraString("firebaseProjectId"),
  storageBucket: requireExtraString("firebaseStorageBucket"),
  messagingSenderId: requireExtraString("firebaseMessagingSenderId"),
  appId: requireExtraString("firebaseAppId"),
  measurementId: requireExtraString("firebaseMeasurementId"),
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
