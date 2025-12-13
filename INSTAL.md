npx expo install expo-dev-client

npx expo prebuild

npx expo run:ios

npx expo run:android



----------------------------------------------

# Login to Expo (opens browser)
npx expo login

# Initialize EAS if not done yet
npx expo register   # only if you don’t have an account
npx expo whoami     # verify login

# Setup EAS config file
npx eas build:configure


# From project root
npx eas build -p android --profile preview

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