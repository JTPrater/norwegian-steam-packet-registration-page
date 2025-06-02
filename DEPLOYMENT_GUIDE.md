# 🚢 Norwegian Steam Packet Company - GitHub Pages Deployment Guide

## ✅ What You Have Now

Your website is now **Firebase-ready** and will work perfectly on **GitHub Pages**! Here's what's set up:

### 🔧 Current Files:

- `index.html` - Registration form with Firebase integration
- `list.html` - Passenger list with real-time updates
- `firebase-config.js` - Production Firebase configuration (needs your credentials)
- `firebase-config-demo.js` - Demo version with localStorage fallback
- All your existing styling and functionality

### 🌟 Key Features:

- ✅ **Real-time passenger updates** (with Firebase)
- ✅ **Avatar image uploads** (stored in Firebase Storage)
- ✅ **Works on GitHub Pages** (static hosting)
- ✅ **Fallback to localStorage** if Firebase fails
- ✅ **Global data sharing** across all visitors

## 🚀 Deployment Steps

### Step 1: Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → Name it "norwegian-steam-packet"
3. **Enable Realtime Database:**
   - Go to "Realtime Database" → "Create Database"
   - Choose "Start in test mode"
4. **Enable Storage:**
   - Go to "Storage" → "Get started"
   - Choose "Start in test mode"
5. **Get your config:**
   - Project Settings → "Your apps" → Add Web App
   - Copy the config object

### Step 2: Update Firebase Configuration

Replace the placeholder values in `firebase-config.js` with your actual Firebase config:

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

### Step 3: Switch to Production Config

In both `index.html` and `list.html`, change:

```html
<script src="firebase-config-demo.js"></script>
```

to:

```html
<script src="firebase-config.js"></script>
```

### Step 4: Deploy to GitHub Pages

1. **Create GitHub Repository:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit - Norwegian Steam Packet Company"
   git branch -M main
   git remote add origin https://github.com/yourusername/norwegian-steam-packet.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**

   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `main` → Save

3. **Your site will be live at:**
   `https://yourusername.github.io/norwegian-steam-packet`

## 🎯 Testing Locally

Currently running on: **http://localhost:8000**

The demo version uses localStorage fallback, so you can test registration and passenger list functionality right now!

## 🔄 How Data Sharing Works

### With Firebase (Production):

- ✅ **Global**: All visitors see the same passengers
- ✅ **Real-time**: New registrations appear instantly
- ✅ **Persistent**: Data saved permanently
- ✅ **Images**: Avatar uploads work properly

### With Demo/Fallback:

- ⚠️ **Local only**: Each browser sees its own data
- ✅ **Functional**: Registration and list work for testing
- ✅ **Images**: Avatars work (stored as data URLs)

## 🛡️ Security (Optional)

For production, update Firebase Database Rules:

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

## 📱 Features Summary

- **Registration Form**: Complete passenger details with luggage tracking
- **Avatar Upload**: Picture upload with fallback to standard avatar
- **Passenger List**: Searchable, filterable list with real-time updates
- **Vintage Design**: Beautiful sepia-themed Norwegian maritime aesthetic
- **Mobile Responsive**: Works on all devices
- **Free Hosting**: GitHub Pages + Firebase free tiers

## 🎉 Final Result

Once deployed, anyone can:

1. Visit your GitHub Pages URL
2. Register as a passenger with their details
3. View the complete passenger manifest
4. See new passengers appear in real-time
5. Search and filter the passenger list

**The passenger list WILL show for everybody!** 🌍
