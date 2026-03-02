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

## Deployment

Because this app relies heavily on **WebSockets** (Socket.io) for real-time chat, it requires a traditional server rather than a serverless function environment.
*Note: Platforms like Netlify are built for static sites and serverless functions, which drop WebSocket connections. Therefore, deploying to **Render**, **Railway**, or **Heroku** is the recommended approach.*

### Deploying as a Monolith (Recommended for Render)

The project is already configured so that the Express backend can serve the compiled React frontend.

1. Create a new "Web Service" on [Render](https://render.com).
2. Connect your GitHub repository containing this code.
3. Use the following settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Deploy! The server will automatically build the React app and serve it on the allocated port.

## License
MIT License
