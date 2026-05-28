# Mardo Café - Next.js + Firebase

A modern Turkish café website built with Next.js 14, Firebase, and React Three Fiber for stunning 3D visuals.

## 🏗️ Architecture

```
/apps
  /web          # Next.js App Router (UI + API routes)
  /functions    # Firebase Cloud Functions
/packages
  /shared       # Shared Zod schemas and TypeScript types
/scripts        # Utility scripts (seeding, etc.)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

```bash
# Install dependencies
yarn install

# Set up environment variables
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local with your Firebase config

# Start Firebase emulators
yarn emulators

# In another terminal, start the dev server
yarn dev
```

### Seed Firestore with sample data

```bash
yarn seed
```

## 🔥 Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable:
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage
3. Get your web app config and add to `.env.local`
4. Generate a service account key for server-side operations

## 📱 Features

- **Multilingual** (English/Turkish)
- **Full Menu System** with categories and cart
- **Table Reservations**
- **Order System** with WhatsApp integration
- **Loyalty Program** (stamp card)
- **Coffee Fortune Telling** (Turkish tradition)
- **Newsletter Signup**
- **3D Visual Effects** with React Three Fiber
- **Firebase Authentication**
- **Firestore Database**
- **Cloud Functions** for background tasks

## 🎨 3D Features

- **Hero Section**: Floating coffee cup with subtle rotation
- **Gallery**: Interactive 3D cards with hover effects
- **Menu Spotlight**: Featured items with 3D presentation

## 📦 Deployment

### Vercel (Recommended for Next.js)
```bash
vercel
```

### Firebase Functions
```bash
yarn deploy:functions
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **3D**: React Three Fiber, Drei
- **Backend**: Next.js API Routes, Firebase Functions
- **Database**: Firestore
- **Auth**: Firebase Auth
- **Storage**: Firebase Storage
- **Validation**: Zod

## 📄 License

MIT
