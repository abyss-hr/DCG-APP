// app.config.js
// Dynamic configuration with environment variables
require('dotenv/config');

module.exports = ({ config }) => {
  // Use ONE key for all map functionality
  const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY;
  
  return {
    ...config,
    plugins: [
      ...(config.plugins || []),
      [
        'expo-maps',
        {
          googleMapsApiKey: googleMapsKey,
        }
      ]
    ],
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: googleMapsKey,
        }
      }
    },
    ios: {
      ...config.ios,
      config: {
        ...config.ios?.config,
        googleMapsApiKey: googleMapsKey,
      }
    },
    extra: {
      ...config.extra,
      // Static map can use the same key
      googleStaticMapsKey: googleMapsKey,
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },
  };
};
