# Sanchar App

Sanchar is a real-time global chat application that allows users to connect instantly across devices and chat in a shared room. It features a modern, mobile-first design, dark mode, and an intuitive user interface.

**Designed and developed by Diksha Bargali.**

## Features
- **Real-time Messaging:** Powered by Socket.io for instant, delay-free communication.
- **Global Chat Room:** Everyone who joins enters a single, shared global room.
- **Online Presence:** See who is currently online in the sidebar (or header on mobile).
- **Responsive Design:** Beautifully scales from desktop monitors to mobile phones.
- **Zero-Setup Login:** Just input a username and start chatting immediately.

## Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide Icons, Socket.io-client.
- **Backend:** Node.js, Express, Socket.io.

## Quick Start (Single Command)

We have configured the project so that both the backend and frontend run together!

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Running Locally

1. **Install dependencies** for the root, client, and server:
   ```bash
   npm run install-all
   ```

2. **Start the application (Development Mode):**
   ```bash
   npm run dev
   ```
   This will simultaneously start the backend server on port 3001 and the frontend Vite server. You can access the app at `http://localhost:5173`.


## License
MIT License
