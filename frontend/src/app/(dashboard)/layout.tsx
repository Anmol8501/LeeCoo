'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  Code,
  FileText,
  Users,
  User,
  LogOut,
  Send,
  MessageSquare,
  Flame,
  Sparkles
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import api from '@/services/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // AI Tutor states
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hi! I am your AI coding tutor. Ask me anything about Data Structures, Algorithms, or how to optimize your code.' }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f1419] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const userText = aiMessage;
    const newHistory = [...chatHistory, { role: 'user', text: userText }];
    setChatHistory(newHistory);
    setAiMessage('');
    setIsAiTyping(true);

    try {
      // Optional: integration with chatbot backend
      const response = await api.post('/chatbot/chat', { message: userText }).catch(() => null);
      
      let aiResponseText = '';
      if (response && response.data && response.data.data) {
        aiResponseText = response.data.data.response;
      } else {
        // Fallback mock response
        aiResponseText = `That's a great question about "${userText}". In DSA, we prioritize optimizing time complexity (O(N)) over brute-force solutions (O(N²)). Let's break this down together!`;
      }

      setChatHistory(prev => [
        ...prev,
        { role: 'ai', text: aiResponseText }
      ]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        { role: 'ai', text: 'Sorry, I encountered an issue connecting to the AI Tutor server. Please try again!' }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Helper to determine if link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const getNavItemClass = (path: string) => {
    const active = isActive(path);
    return `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
        : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-[#1a2332]/40 border border-transparent'
    }`;
  };

  // Format workspace title based on path
  const getWorkspaceTitle = () => {
    if (pathname === '/') return 'Dashboard Overview';
    if (pathname.startsWith('/learning')) return 'Learning Path';
    if (pathname.startsWith('/questions')) return 'Solve Problems';
    if (pathname.startsWith('/profile')) return 'Account Settings';
    if (pathname.startsWith('/sheets')) return 'Curated Sheets';
    if (pathname.startsWith('/classroom')) return 'Classrooms';
    return 'Workspace';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9]">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-slate-200 dark:border-[#1e293b]/70 bg-[#f1f5f9] dark:bg-[#0a0f1d] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand Header */}
          <Link href="/" className="h-16 flex items-center px-6 gap-3 border-b border-slate-200 dark:border-[#1e293b]/50 cursor-pointer">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <Brain className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight text-slate-950 dark:text-white">CodeLearn</h1>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400/80 uppercase tracking-wider">AI Platform</span>
            </div>
          </Link>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            <Link href="/" className={getNavItemClass('/')}>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/learning" className={getNavItemClass('/learning')}>
              <BookOpen className="w-4 h-4" />
              Learning Path
            </Link>
            <Link href="/questions" className={getNavItemClass('/questions')}>
              <Code className="w-4 h-4" />
              Solve Problems
            </Link>
            <Link href="/sheets" className={getNavItemClass('/sheets')}>
              <FileText className="w-4 h-4" />
              Curated Sheets
            </Link>
            <Link href="/classroom" className={getNavItemClass('/classroom')}>
              <Users className="w-4 h-4" />
              Classrooms
            </Link>
          </nav>
        </div>

        {/* User Card Profile Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1e293b]/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-[#1a2332]/25 border border-slate-200 dark:border-[#10b981]/20">
            <Link href="/profile" className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-300 group-hover:bg-emerald-500/25 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user.roll_no || user.email}
                </p>
              </div>
            </Link>
            <button 
              onClick={logout}
              title="Log Out"
              className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-1 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-16 border-b border-slate-200 dark:border-[#1e293b]/50 px-8 flex items-center justify-between bg-white/80 dark:bg-[#0a0f1d]/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Workspace</h2>
            <p className="text-base font-bold capitalize text-slate-800 dark:text-white">{getWorkspaceTitle()}</p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <Flame className="w-4 h-4 fill-amber-500/10" />
              5 Day Streak
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              API Connected
            </div>
          </div>
        </header>

        {/* CONTENT DOCK */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* FLOATING AI TUTOR COLLAPSED/EXPANDED */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {aiChatOpen && (
          <div className="w-[380px] h-[500px] mb-4 rounded-2xl flex flex-col shadow-[0_0_25px_rgba(16,185,129,0.15)] overflow-hidden animate-float bg-white dark:bg-[#0f1419] border border-slate-200 dark:border-[#10b981]/30">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-[#10b981]/30 bg-slate-50 dark:bg-[#0f1419] flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-[#f0f9ff]">Interactive AI Tutor</h4>
                  <span className="text-[10px] text-emerald-600 dark:text-[#2dd4bf] font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    CodeLearn AI
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAiChatOpen(false)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-[#f0f9ff] text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-[#1a2332] hover:bg-slate-200 dark:hover:bg-[#1a2332]/80 border border-slate-200 dark:border-[#10b981]/20 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-[#0f1419]">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed my-1 ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 dark:bg-[#10b981] text-white font-medium shadow-[0_4px_12px_rgba(16,185,129,0.15)]'
                      : 'bg-white dark:bg-[#1f2937] border border-emerald-500/25 dark:border-[#10b981] text-slate-700 dark:text-[#2dd4bf] shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#1f2937] border border-emerald-500/25 dark:border-[#10b981] text-slate-400 dark:text-[#2dd4bf] rounded-xl px-4 py-3 text-xs flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-slate-200 dark:border-[#10b981]/30 bg-white dark:bg-[#0f1419] flex gap-2">
              <input
                type="text"
                placeholder="Ask about a problem, complexity, error..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                className="flex-1 rounded-lg px-4 py-2 text-xs bg-slate-50 dark:bg-[#1a2332] border border-slate-200 dark:border-[#10b981] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 placeholder-slate-400 dark:placeholder-emerald-700 transition-all"
              />
              <button
                type="submit"
                disabled={isAiTyping}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white font-medium text-xs transition-all shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setAiChatOpen(!aiChatOpen)}
          className={`flex items-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-sm shadow-xl transition-all hover:scale-105 duration-300 ${
            aiChatOpen
              ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border-none'
              : 'bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#10b981]/30 text-emerald-600 dark:text-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.1)] hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 dark:hover:border-emerald-400'
          }`}
        >
          {aiChatOpen ? (
            <MessageSquare className="w-5 h-5" />
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <Brain className="w-5 h-5 animate-bounce" />
              AI Coding Tutor
            </>
          )}
        </button>
      </div>

    </div>
  );
}
