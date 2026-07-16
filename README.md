# Rk's Chat Application

Real-time chat app built with React and Firebase — live messaging, unread-count tracking, and image/audio/file attachments.

**[Live Demo →](https://rkchat.netlify.app/)**

## What it does
Users sign up, browse other registered users, and chat in real time. Messages sync instantly via
Firestore, unread counts update atomically per-chat, and users can send images and audio/file
attachments alongside text — with audio rendering as an inline playable player and other file types
as a download link.

## Tech Stack
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%2F_Firestore_%2F_Storage-FFCA28?logo=firebase&logoColor=black)
![SCSS](https://img.shields.io/badge/SCSS-Styling-CC6699?logo=sass&logoColor=white)
![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?logo=netlify&logoColor=white)

## Architecture / How it works
- **Auth**: Firebase Auth (email/password) via a custom `AuthContext`, with a Firestore `users` doc
  and profile picture created on signup for cross-referencing display names and avatars in chats.
- **Messaging**: each 1:1 chat is keyed by a deterministic combined UID
  (`uidA > uidB ? uidA+uidB : uidB+uidA`), with messages stored as an array on a single Firestore
  doc and synced live via `onSnapshot` — no polling.
- **Unread tracking**: uses Firestore's atomic `increment()` on the recipient's `userChats` doc to
  avoid read-then-write race conditions, and resets to 0 when they open the chat.
- **Attachments**: images and files (audio, etc.) upload to Firebase Storage; messages store the
  resulting URL and file metadata (name, size, MIME type) separately from the text field, so the UI
  renders an inline `<audio>` player for audio files or a download link for anything else — instead
  of overwriting the message text with the filename.
- **Seen receipts**: the recipient's message listener marks incoming messages as seen on read, shown
  as a "Seen" label under the sender's own messages.
- **Search**: live user search by display name via Firestore queries in the sidebar.

## Setup & Run
```bash
git clone https://github.com/rk1091/Rk-Chat-Application-.git
cd Rk-Chat-Application-/chat-app
npm install
# Add your own Firebase config to src/firebase.js (Firebase Console → Project Settings)
npm start
```
Runs on `http://localhost:3000`.

## What I learned / Key challenges
- Using Firestore's atomic `increment()` / `arrayUnion()` operators to avoid race conditions when
  two users write to shared documents concurrently — a subtle bug class that's easy to miss with a
  naive read-then-write approach.
- Separating file metadata from message text so attachments render correctly by type (audio player
  vs. download link) instead of the filename silently overwriting what the user typed.
- Structuring real-time Firestore listeners so UI state (unread badges, seen receipts, live message
  sync) stays consistent without manual refresh or polling.
- Built by extending a React + Firebase chat tutorial as a foundation — added unread-message
  tracking, file/audio attachments, real timestamps, and seen receipts on top of the base auth +
  messaging flow.
