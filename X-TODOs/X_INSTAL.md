npx expo install expo-dev-client

npx expo prebuild

npx expo run:ios

npx expo run:android


npx eas build -p android --profile development


----------------------------------------------

Local builds (faster, for testing):

npx expo run:ios          # iOS simulator
npx expo run:android      # Android emulator  

Cloud build (for device testing):

npx eas build -p ios --profile development
npx eas build -p android --profile development


----------------------------------------------

# Login to Expo (opens browser)
npx expo login

# Initialize EAS if not done yet
npx expo register   # only if you don’t have an account
npx expo whoami     # verify login

# Setup EAS config file
npx eas build:configure

npx eas build -p android --profile development

# From project root
npx eas build -p android --profile preview (ovaj je kao app, nije dev tool)

----------------------------------------------


cd /Users/abyss/dcg-app

# If not already a git repo
git init

# Ignore node_modules etc. if not present yet
echo "node_modules
.expo
dist
build
.env
" >> .gitignore

git add .
git commit -m "Initial commit"

# Create a new empty repo on github.com (via web UI), e.g. abyss/dcg-app
# Then add the remote (replace URL with your repo URL):
git remote add origin https://github.com/<your-user>/dcg-app.git
git branch -M main
git push -u origin main



EAS secret - umjesto .env file - kasnije za build napraviti EAS SECRET for google API

Correct way (this WILL work)
Step 1 — Make sure EAS is installed
npm install -g eas-cli

Step 2 — Login
eas login

Step 3 — Link project (only once)
eas project:init


(Select your existing project — do not create a new one)

Step 4 — Set the secret (THIS is the correct command)
eas secret:create --name GOOGLE_STATIC_MAPS_KEY --value YOUR_API_KEY


You should see:

✔ Secret GOOGLE_STATIC_MAPS_KEY created


✅ Done
❌ No .env required for production builds
✅ Key never enters git

🔧 Local dev (optional)

If you want it to work in Expo Go / dev, also add .env:

GOOGLE_STATIC_MAPS_KEY=AIzaSyXXXX


Expo will prefer .env locally, EAS Secrets in builds.