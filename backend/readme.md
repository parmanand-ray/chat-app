# Chat App Project Overview

This project is a full-stack real-time chat application built with a backend in Node.js/Express/MongoDB and a frontend in React/Vite/Tailwind. The app supports user authentication, real-time messaging with Socket.io, unread/read message states, conversation previews, and an admin panel.

## Project Structure

- `backend/`
  - `index.js` — main Express server entry point and Socket.io setup.
  - `config/` — database and Cloudinary configuration files.
  - `controllers/` — business logic for auth, user, message, and admin operations.
  - `middlewares/` — authentication and admin authorization.
  - `models/` — Mongoose schemas for `User`, `Conversation`, and `Message`.
  - `routes/` — Express routers for auth, user, message, and admin endpoints.
  - `socket/socket.js` — Socket.io server logic, online user tracking, and event emission.
  - `uploads/` — temporary upload storage for files before Cloudinary upload.

- `frontend/`
  - `src/main.jsx` — React application bootstrap with Redux provider and router.
  - `src/App.jsx` — top-level app routes, socket connection lifecycle, and global state setup.
  - `src/components/` — reusable UI components like `SideBar`, `ChatContainer`, `SenderMessage`, `ReceiverMessage`.
  - `src/pages/` — page-level components such as `Home`, `Login`, `SignUp`, `Profile`, `Admin`.
  - `src/redux/` — Redux Toolkit slice and store for user/chat state.
  - `src/costomHooks/` — custom React hooks for fetching current user, user list, and messages.
  - `src/main.js` — front-end constant definitions like `serverUrl`.

## Backend Responsibilities

### Authentication
- Users sign up and log in using email/phone/password.
- JWT is stored in cookies and validated by `middlewares/isAuth.js`.
- The backend protects routes under `/api/user` and `/api/message`.

### User Management
- `GET /api/user/current` returns the logged-in user's profile.
- `GET /api/user/all-users` returns all other users plus conversation metadata.
- Admin endpoints exist for managing users separately under `/api/admin`.

### Messaging
- `Message` documents track `sender`, `receiver`, `message`, `image`, `isRead`, and `readAt`.
- `Conversation` documents store `participants`, `messages`, and `lastMessage`.
- `sendMessage` creates a message, updates the conversation, and emits socket events:
  - `newMessage` for the receiver
  - `conversationUpdated` for sidebar updates
- `getMessages` loads the chat, marks incoming messages as read, and emits `messagesRead`.

### Real-time Events
- Socket.io maps connected users to socket IDs.
- The backend sends:
  - `getOnlineUesrs` when connection state changes
  - `newMessage` for incoming chat messages
  - `conversationUpdated` to refresh last message previews and unread counters
  - `messagesRead` to update read receipts

## Frontend Responsibilities

### App Initialization
- `App.jsx` loads the current user and all users at startup.
- It creates the Socket.io client once the user is loaded.
- Global socket events update online status, unread counts, and conversation previews.

### Chat UI
- `SideBar.jsx` renders the user list, last message preview, timestamp, and unread badge.
- `ChatContainer.jsx` renders the current chat, loads messages, and sends new messages.
- `SenderMessage.jsx` and `ReceiverMessage.jsx` display message bubbles with image support and read tick status.

### State Management
- Redux stores:
  - `userData` — the logged-in user
  - `allUsers` — user list with conversation metadata
  - `selectedUser` — currently open chat partner
  - `onlineUsers` — currently online user IDs
  - `socket` — the socket client instance
- `updateUserLastMessage` updates preview data and unread counts when socket events arrive.

## Important Files and Behavior

### Key backend files
- `backend/index.js` — starts Express and Socket.io server.
- `backend/models/message.model.js` — contains `isRead` and `readAt` fields.
- `backend/controllers/message.controllers.js` — handles message sending, conversation updates, and read receipts.
- `backend/socket/socket.js` — tracks connected sockets and broadcasts online user lists.

### Key frontend files
- `frontend/src/App.jsx` — socket lifecycle and route configuration.
- `frontend/src/components/SideBar.jsx` — user search, unread badge, and chat selection.
- `frontend/src/components/ChatContainer.jsx` — loads messages and appends new messages in real time.
- `frontend/src/redux/userSlice.js` — state updates for conversation list and selected chat.

## Running Locally

### Backend
1. Set environment variables in `backend/.env`.
2. Install dependencies in `backend/`:
   - `npm install`
3. Start backend:
   - `npm run dev`

### Frontend
1. Install dependencies in `frontend/`:
   - `npm install`
2. Start frontend:
   - `npm run dev`

### Environment
- `backend/.env` should include a valid `MONGODB_URL` and `JWT_SECRET_KEY`.
- `frontend/src/main.jsx` uses `serverUrl = "http://localhost:3000"` to call backend APIs.

## Why the MongoDB Error Happens

The backend tries to connect to MongoDB using `MONGODB_URL`.
If the URL points to Atlas and your machine cannot resolve or reach `mongodb.net`, the app will fail to connect.
This is a network/environment issue, not a code issue.

## Notes for This Project

- This project is already structured into separate backend and frontend apps.
- The `.md` file is documentation only; no source code changes are required here.
- The app is meant to support real-time chat, unread/read tracking, and admin user management.

---

If you want, I can also create a second `.md` file with a shorter “quick start” guide that only covers the most important setup steps.
