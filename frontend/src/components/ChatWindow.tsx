"use client";

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageCircle, X, User, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ChatMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  bookingId?: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  role: 'customer' | 'staff' | 'admin';
  avatar?: string;
}

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
  bookingId?: string;
  onClose: () => void;
}

export default function ChatWindow({ recipientId, recipientName, bookingId, onClose }: ChatWindowProps) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001');

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Authenticate user
      if (user) {
        newSocket.emit('authenticate', {
          userId: user.id,
          role: user.role
        });

        // Join booking chat if applicable
        if (bookingId) {
          newSocket.emit('join_booking_chat', { bookingId });
        }
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Handle incoming messages
    newSocket.on('private_message', (message: ChatMessage) => {
      if (message.fromUserId === recipientId || message.toUserId === recipientId) {
        setMessages(prev => [...prev, message]);
      }
    });

    newSocket.on('booking_message', (message: ChatMessage) => {
      if (message.bookingId === bookingId) {
        setMessages(prev => [...prev, message]);
      }
    });

    // Handle typing indicators
    newSocket.on('typing_start', (data: { fromUserId: string }) => {
      if (data.fromUserId === recipientId) {
        setIsTyping(true);
      }
    });

    newSocket.on('typing_stop', (data: { fromUserId: string }) => {
      if (data.fromUserId === recipientId) {
        setIsTyping(false);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, recipientId, bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !user) return;

    const messageData = {
      toUserId: recipientId,
      message: newMessage.trim(),
      ...(bookingId && { bookingId })
    };

    if (bookingId) {
      socket.emit('booking_message', messageData);
    } else {
      socket.emit('private_message', messageData);
    }

    // Add message to local state immediately
    const message: ChatMessage = {
      id: `temp_${Date.now()}`,
      fromUserId: user.id,
      toUserId: recipientId,
      bookingId,
      message: newMessage.trim(),
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Stop typing indicator
    if (socket) {
      socket.emit('typing_stop', { toUserId: recipientId });
    }
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit('typing_start', { toUserId: recipientId });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { toUserId: recipientId });
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-80 h-96 flex flex-col shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">{recipientName}</CardTitle>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-3 space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.fromUserId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-lg text-sm ${
                  message.fromUserId === user?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.message}</p>
                <div className={`flex items-center gap-1 mt-1 text-xs ${
                  message.fromUserId === user?.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <Clock className="w-3 h-3" />
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              } else {
                handleTyping();
              }
            }}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Chat Button Component
export function ChatButton({ recipientId, recipientName, bookingId }: {
  recipientId: string;
  recipientName: string;
  bookingId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50">
          <ChatWindow
            recipientId={recipientId}
            recipientName={recipientName}
            bookingId={bookingId}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}