# Firebase Setup Guide for Norwegian Steam Packet Company

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it something like "norwegian-steam-packet"
4. Follow the setup wizard

## Step 2: Enable Services

### Enable Realtime Database:

1. In your Firebase project, go to "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" (you can secure it later)
4. Select a location close to your users

### Enable Storage:

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode"

## Step 3: Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and choose Web (</> icon)
4. Register your app (name it whatever you want)
5. Copy the configuration object

## Step 4: Update firebase-config.js

Replace the placeholder values in `firebase-config.js` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

## Step 5: Set Database Rules (Optional - for security)

In Realtime Database > Rules, you can use:

```json
{
  "rules": {
    "passengers": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Step 6: Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Choose source branch (usually `main` or `master`)
4. Your site will be available at `https://yourusername.github.io/repository-name`

## Features You'll Have:

✅ **Real-time updates** - New passengers appear automatically
✅ **Image uploads** - Avatar images stored in Firebase Storage
✅ **Global sharing** - All visitors see the same data
✅ **Free hosting** - GitHub Pages + Firebase free tiers
✅ **No server maintenance** - Fully serverless

## Testing Locally:

To test locally before deploying:

1. Serve the files with a local server (not just opening HTML files)
2. You can use: `python -m http.server 8000` or `npx serve .`
3. Open `http://localhost:8000`

The Firebase integration will work both locally and on GitHub Pages!
