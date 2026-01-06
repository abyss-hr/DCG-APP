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
    },
  };
};
