# 🏆 SportZone Admin Dashboard

Admin panel for SportZone e-commerce, built with React + Firebase.

## 🚀 Setup

```bash
npm install
npm run dev
```

## ⚙️ Firebase Setup (Required)

### 1. Create Admin Account in Firebase
- Go to Firebase Console → Authentication → Users
- Click "Add user"
- Email: `admin@sportzone.com`
- Password: `admin123`

### 2. Firestore Rules
Go to Firestore → Rules and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Seed Data
After logging in, click "🌱 Seed Sample Data" on the Dashboard to populate products, posts, and orders.

## ✅ Features
- 🔐 Firebase Authentication
- 📊 Dashboard with live stats
- 🏀 Products: Add, Edit, Delete, Toggle Stock
- 📝 Posts: Approve, Reject, Delete, Add new
- 📦 Orders: View details, Update status
- 🔄 Real-time updates via Firestore
