# Google Maps Setup Guide

## ✅ What's Already Done:
1. ✅ expo-maps installed
2. ✅ app.config.js configured with expo-maps plugin
3. ✅ .env file created with API key placeholders

## 🔧 What You Need To Do in Google Cloud Console:

### 1. Go to Google Cloud Console
https://console.cloud.google.com/

### 2. Create/Select a Project
- Create a new project or select your existing one

### 3. Enable Required APIs
Go to "APIs & Services" → "Library" and enable:
- ✅ **Maps SDK for Android** (required for Android)
- ✅ **Maps SDK for iOS** (required for iOS)
- ✅ **Maps Static API** (already enabled for StaticMap)
- ✅ **Places API** (optional, for place searches)
- ✅ **Geocoding API** (optional, for address lookups)

### 4. Get API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key

### 5. Restrict API Key (Important for Security!)

#### For Android:
1. Click on your API key
2. Under "Application restrictions" → Select "Android apps"
3. Add your package name: `com.abysshr.dcgapp`
4. Add SHA-1 fingerprint (get from your keystore)

#### For iOS:
1. Create a separate API key for iOS
2. Under "Application restrictions" → Select "iOS apps"
3. Add your bundle ID: `com.abyss-hr.dcgapp`

### 6. Update .env File
Replace the key in `/Users/abyss/dcg-app/.env`:
```
GOOGLE_STATIC_MAPS_KEY=YOUR_API_KEY_HERE
GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

### 7. Rebuild Your App
```bash
npx expo prebuild --clean
npx expo run:ios
# or
npx expo run:android
```

## 📱 Current Configuration:

The app is configured to:
- Use StaticMap for preview thumbnails
- Use expo-maps for interactive maps (when implemented)
- Support both iOS (Apple Maps) and Android (Google Maps)

## 🔐 Current API Key:
Your current key: `AIzaSyBc2BrYPijka4H5AS09FvlABaHJ3UebQSc`
- Make sure this key has all the required APIs enabled!
- Consider creating separate keys for Static Maps and SDK Maps

## ⚠️ Important Notes:
1. The same API key can be used for both GOOGLE_STATIC_MAPS_KEY and GOOGLE_MAPS_API_KEY
2. But it's recommended to create separate keys with different restrictions for better security
3. You'll need to rebuild your app after changing API keys
