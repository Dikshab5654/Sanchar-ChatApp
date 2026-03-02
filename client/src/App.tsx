import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, Users, User, MessageSquare, LogOut } from 'lucide-react';

// Use same host port 3001 on local dev, use origin url in production
const SOCKET_URL = import.meta.env.PROD ? window.location.origin : `http://${window.location.hostname}:3001`;

type Message = {
  id: string;
  userId?: string;
  username?: string;
  content: string;
  type: 'user' | 'system';
  timestamp: string;
};

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isJoined) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('join', username);
      });

      newSocket.on('message-history', (history: Message[]) => {
        setMessages(history);
      });

      newSocket.on('receive-message', (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });

      newSocket.on('online-users', (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isJoined, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsJoined(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && socket) {
      socket.emit('send-message', inputValue.trim());
      setInputValue('');
    }
  };

  const handleLeave = () => {
    setIsJoined(false);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setUsername('');
    setMessages([]);
    setOnlineUsers([]);
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-5 rounded-3xl shadow-lg shadow-indigo-500/30 transform transition hover:scale-105">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 text-center mb-2 tracking-tight">SANCHAR APP</h1>
          <p className="text-gray-400 text-center mb-8">Connect instantly. Chat globally.</p>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username..."
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25"
            >
              Start Chatting
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">Designed and developed by <span className="text-indigo-400 font-medium tracking-wide">Diksha Bargali</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      {/* Sidebar - Online Users */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <Users className="text-indigo-500 w-5 h-5" />
          <h2 className="font-semibold text-lg">Online Now</h2>
          <span className="ml-auto bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-300">
            {onlineUsers.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {onlineUsers.map((user, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-950 p-2 rounded-lg border border-gray-800/50">
              <div className="w-8 h-8 bg-indigo-900/50 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0">
                {user.charAt(0).toUpperCase()}
              </div>
              <span className="truncate text-sm font-medium text-gray-200">{user}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-md">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="font-semibold text-gray-200 truncate">{username}</p>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Exit Chat"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-tight">SANCHAR</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              {onlineUsers.length}
            </div>
            <button
              onClick={handleLeave}
              className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 md:pb-4 scroll-smooth">
          {messages.map((msg) => {
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-gray-800/50 border border-gray-800 text-gray-400 text-xs px-4 py-1.5 rounded-full flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {msg.content}
                  </div>
                </div>
              );
            }

            const isMe = msg.username === username;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                <div className={`flex flex-col max-w-[75%] md:max-w-[60%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <span className="text-xs text-gray-400 ml-1 mb-1 font-medium">{msg.username}</span>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl shadow-sm ${isMe
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700/50'
                      }`}
                  >
                    <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                  </div>
                  <span className={`text-[10px] text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'mr-1' : 'ml-1'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute md:relative bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800">
          <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white p-3 rounded-xl transition-colors flex items-center justify-center min-w-[56px] shadow-lg disabled:shadow-none"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
