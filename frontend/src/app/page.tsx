'use client';

import React, { useState } from 'react';
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  Code,
  FileText,
  Users,
  Settings,
  Flame,
  CheckCircle2,
  Activity,
  ArrowRight,
  Sparkles,
  User,
  LogOut,
  Send,
  MessageSquare
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hi! I am your AI coding tutor. Ask me anything about Data Structures, Algorithms, or how to optimize your code.' }
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', text: aiMessage }];
    setChatHistory(newHistory);
    setAiMessage('');

    // Mock response
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        { role: 'ai', text: `That's a great question about "${aiMessage}". In DSA, we prioritize optimizing time complexity (O(N)) over brute-force solutions (O(N²)). Let's break this down together!` }
      ]);
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-[#f1f5f9]">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-slate-200 dark:border-[#1e293b]/70 bg-[#f1f5f9] dark:bg-[#0a0f1d] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-200 dark:border-[#1e293b]/50">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <Brain className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">CodeLearn</h1>
              <span className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider">AI Platform</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-white/40 dark:bg-[#1a2332]/40 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'learning'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-white/40 dark:bg-[#1a2332]/40 border border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Learning Path
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'questions'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-white/40 dark:bg-[#1a2332]/40 border border-transparent'
              }`}
            >
              <Code className="w-4 h-4" />
              Solve Problems
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'sheets'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-white/40 dark:bg-[#1a2332]/40 border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              Curated Sheets
            </button>
            <button
              onClick={() => setActiveTab('classroom')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'classroom'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-white/40 dark:bg-[#1a2332]/40 border border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              Classrooms
            </button>
          </nav>
        </div>

        {/* User Card Profile Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1e293b]/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/20 dark:bg-[#1a2332]/20 border border-slate-200 dark:border-[#10b981]/20/40">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-300">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Alex Mercer</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">CS2024045</p>
            </div>
            <button className="text-slate-500 dark:text-slate-400 hover:text-red-400 p-1 rounded transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-16 border-b border-slate-200 dark:border-[#1e293b]/50 px-8 flex items-center justify-between bg-white/80 dark:bg-[#0a0f1d]/ backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Workspace</h2>
            <p className="text-lg font-semibold capitalize">{activeTab} Overview</p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <Flame className="w-4 h-4 fill-amber-500/10" />
              5 Day Streak
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              API Connected
            </div>
          </div>
        </header>

        {/* CONTENT DOCK */}
        <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* STATS OVERVIEW SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat Item 1 */}
            <div className="glass-panel p-6 rounded-xl card-hover-effect">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Solved</p>
                  <h3 className="text-3xl font-extrabold mt-1">45</h3>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="font-semibold text-emerald-400">+3 today</span>
                <span className="text-slate-500">Practice target</span>
              </div>
            </div>

            {/* Stat Item 2 */}
            <div className="glass-panel p-6 rounded-xl card-hover-effect">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Submissions</p>
                  <h3 className="text-3xl font-extrabold mt-1">120</h3>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Code className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="font-semibold text-emerald-400">37.5% Acc</span>
                <span className="text-slate-500">Submission ratio</span>
              </div>
            </div>

            {/* Stat Item 3 */}
            <div className="glass-panel p-6 rounded-xl card-hover-effect">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topics Completed</p>
                  <h3 className="text-3xl font-extrabold mt-1">3 / 15</h3>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="font-semibold text-emerald-400">20% complete</span>
                <span className="text-slate-500">Overall progress</span>
              </div>
            </div>

            {/* Stat Item 4 */}
            <div className="glass-panel p-6 rounded-xl card-hover-effect bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">AI Tutor Hints</p>
                  <h3 className="text-3xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">24 / 30</h3>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="font-semibold text-emerald-300">Remaining</span>
                <span className="text-slate-500">Resets hourly</span>
              </div>
            </div>

          </div>

          {/* MAIN GRAPHICS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Heatmap Section */}
            <div className="glass-panel p-6 rounded-xl lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-base">Activity Heatmap</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Track your daily submission consistency</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1">
                  View Analytics <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              
              {/* Dummy Heatmap Grid */}
              <div className="flex flex-col gap-2 p-4 bg-[#0f1419]/45 rounded-lg border border-slate-200 dark:border-[#10b981]/20/40">
                <div className="flex flex-wrap gap-1.5 justify-between">
                  {Array.from({ length: 70 }).map((_, i) => {
                    const intensities = ['bg-slate-200 dark:bg-[#1a2332]/40', 'bg-emerald-200 dark:bg-emerald-900/40', 'bg-emerald-300 dark:bg-emerald-700/60', 'bg-emerald-400 dark:bg-emerald-500/80', 'bg-emerald-500 dark:bg-emerald-400'];
                    const color = intensities[i % 5 === 0 ? 0 : Math.floor(Math.random() * 5)];
                    return (
                      <div
                        key={i}
                        className={`w-3.5 h-3.5 rounded-sm ${color} transition-colors duration-300 hover:ring-2 hover:ring-emerald-400`}
                        title={`Day ${i + 1}: ${Math.floor(Math.random() * 5)} Submissions`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-200 dark:border-[#10b981]/20/30">
                  <span>Less active</span>
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-[#1a2332]/40" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-700/60" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-500/80" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-400" />
                  </div>
                  <span>More active</span>
                </div>
              </div>
            </div>

            {/* In Progress Tasks / Classrooms */}
            <div className="glass-panel p-6 rounded-xl space-y-6">
              <h4 className="font-bold text-base">Joined Classrooms</h4>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/25 dark:bg-[#1a2332]/25 border border-slate-200 dark:border-[#10b981]/20 hover:border-emerald-500/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-semibold">DSA Bootcamp 2026</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instructor: Dr. Alan Turing</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                      Active
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>12 Assignments</span>
                    <span>45 students</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/25 dark:bg-[#1a2332]/25 border border-slate-200 dark:border-[#10b981]/20 hover:border-emerald-500/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-semibold">Advanced Algorithms</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instructor: Prof. Hopper</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-full border border-slate-500/20">
                      Ended
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>6 Assignments</span>
                    <span>32 students</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </main>
      </div>

      {/* FLOATING AI TUTOR COLLAPSED/EXPANDED */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {aiChatOpen && (
          <div className="w-[380px] h-[500px] mb-4 rounded-2xl flex flex-col shadow-[0_0_15px_rgba(16,185,129,0.15)] overflow-hidden animate-float bg-[#f8fafc] dark:bg-[#0f1419] border border-slate-200 dark:border-[#10b981]/30">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-[#10b981]/30 bg-[#f8fafc] dark:bg-[#0f1419] flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-[#059669]/10 dark:bg-[#10b981]/10 border border-slate-200 dark:border-[#10b981]/30 text-[#10b981]">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-[#f0f9ff]">Interactive AI Tutor</h4>
                  <span className="text-[10px] text-emerald-700 dark:text-[#2dd4bf] font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    CodeLearn AI
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAiChatOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#f0f9ff] text-xs font-semibold px-2 py-1 rounded bg-white dark:bg-[#1a2332] hover:bg-white/80 dark:bg-[#1a2332]/80 border border-slate-200 dark:border-[#10b981]/20 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8fafc] dark:bg-[#0f1419]">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed my-1 ${
                    msg.role === 'user'
                      ? 'bg-[#059669] dark:bg-[#10b981] text-white font-medium shadow-[0_4px_15px_rgba(16,185,129,0.2)]'
                      : 'bg-white dark:bg-[#1a2332] border-2 border-emerald-500/50 dark:border-[#10b981] text-emerald-700 dark:text-[#2dd4bf] shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-slate-200 dark:border-[#10b981]/30 bg-[#f8fafc] dark:bg-[#0f1419] flex gap-2">
              <input
                type="text"
                placeholder="Ask about a problem, complexity, error..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                className="flex-1 rounded-lg px-4 py-2 text-xs bg-white dark:bg-[#1a2332] border-2 border-emerald-500/50 dark:border-[#10b981] text-white focus:outline-none focus:shadow-[0_0_12px_rgba(16,185,129,0.4)] placeholder-[#059669] transition-shadow"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#059669] dark:bg-[#10b981] hover:bg-[#047857] dark:hover:bg-[#059669] text-white transition-all hover:shadow-[0_0_12px_rgba(16,185,129,0.5)] border-none cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Pulsing Toggle Button */}
        <button
          onClick={() => setAiChatOpen(!aiChatOpen)}
          className={`flex items-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-sm shadow-xl transition-all hover:scale-105 duration-300 ${
            aiChatOpen
              ? 'bg-[#059669] dark:bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-white dark:bg-[#1a2332] border-2 border-emerald-500/50 dark:border-[#10b981] text-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:border-[#2dd4bf] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]'
          }`}
        >
          {aiChatOpen ? (
            <MessageSquare className="w-5 h-5" />
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#059669] dark:bg-[#10b981]"></span>
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
