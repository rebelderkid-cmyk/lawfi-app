'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Type for a chat item
type Chat = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    content: string;
  }>;
  _count: {
    messages: number;
  };
};

type ChatSidebarProps = {
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
};

export default function ChatSidebar({ currentChatId, onChatSelect, onNewChat }: ChatSidebarProps) {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chat history when component mounts or session changes
  useEffect(() => {
    if (session) {
      fetchChats();
    }
  }, [session]);

  const fetchChats = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const response = await fetch('/api/chats');
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // Don't show sidebar for guests
  if (!session) {
    return null;
  }

  // Helper to format date
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return d.toLocaleDateString();
  };

  // Helper to get chat preview
  const getChatPreview = (chat: Chat) => {
    if (chat.messages.length > 0) {
      return chat.messages[0].content.substring(0, 50) + '...';
    }
    return 'New conversation';
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Desktop Collapse/Expand Button */}
      {!isCollapsed && (
        <button
          onClick={() => setIsCollapsed(true)}
          className="hidden lg:block fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all group"
          title="Hide sidebar"
        >
          <svg className="w-5 h-5 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="hidden lg:block fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all group"
          title="Show sidebar"
        >
          <svg className="w-5 h-5 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-0 lg:border-0 lg:overflow-hidden' : 'w-80'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className={`flex-1 overflow-y-auto p-3 space-y-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-gray-500 text-sm">No chat history yet</p>
              <p className="text-gray-400 text-xs mt-1">Start a new conversation!</p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  currentChatId === chat.id
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-medium text-sm truncate ${
                        currentChatId === chat.id ? 'text-indigo-900' : 'text-gray-900'
                      }`}
                    >
                      {chat.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {getChatPreview(chat)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        {formatDate(chat.updatedAt)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {chat._count.messages} {chat._count.messages === 1 ? 'message' : 'messages'}
                      </span>
                    </div>
                  </div>
                  {currentChatId === chat.id && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Your chats are saved</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && !isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
