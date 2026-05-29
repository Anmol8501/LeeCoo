'use client';

import React, { useState, useEffect } from 'react';
import { learningService, Topic } from '@/services/learningService';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  Layers,
  Code2,
  ListCollapse,
  GitFork,
  Network,
  Cpu
} from 'lucide-react';

export default function LearningPathPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [continueTopics, setContinueTopics] = useState<Topic[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const langFilter = selectedLanguage === 'all' ? undefined : selectedLanguage;
        const [allTopics, inProgress] = await Promise.all([
          learningService.getTopics(langFilter),
          learningService.getContinueLearning(),
        ]);
        setTopics(allTopics);
        setContinueTopics(inProgress);
      } catch (err) {
        console.error('Failed to load topics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedLanguage]);

  // Filter topics by search query locally
  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to map icon names to Lucide icons
  const getTopicIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'array':
      case 'arrays':
      case 'code':
        return <Code2 className="w-6 h-6 text-emerald-500" />;
      case 'list':
      case 'linkedlist':
        return <Layers className="w-6 h-6 text-emerald-500" />;
      case 'stack':
      case 'queue':
        return <ListCollapse className="w-6 h-6 text-emerald-500" />;
      case 'tree':
      case 'trees':
        return <GitFork className="w-6 h-6 text-emerald-500" style={{ transform: 'rotate(180deg)' }} />;
      case 'graph':
      case 'graphs':
        return <Network className="w-6 h-6 text-emerald-500" />;
      case 'dp':
      case 'dynamicprogramming':
        return <Cpu className="w-6 h-6 text-emerald-500" />;
      default:
        return <BookOpen className="w-6 h-6 text-emerald-500" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-500/10 dark:text-green-400 dark:bg-green-500/15 border-green-500/20';
      case 'medium':
        return 'text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/15 border-amber-500/20';
      case 'hard':
        return 'text-red-600 bg-red-500/10 dark:text-red-400 dark:bg-red-500/15 border-red-500/20';
      default:
        return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      
      {/* CONTINUE LEARNING BANNER */}
      {!isLoading && continueTopics.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-600/5 to-transparent border border-emerald-500/25 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-emerald-500/15 rounded-xl border border-emerald-500/20 text-emerald-500">
              <Flame className="w-6 h-6 fill-emerald-500/10 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-[#f0f9ff]">Resume Learning</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You have active progress in <span className="font-semibold text-slate-700 dark:text-emerald-300">{continueTopics[0].title}</span>. Pick up right where you left off!
              </p>
            </div>
          </div>
          <Link
            href={`/learning/${continueTopics[0].id}`}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            Continue Study <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* FILTER & SEARCH ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1e293b]/50">
        {/* Languages Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'javascript', 'python', 'cpp', 'java'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                selectedLanguage === lang
                  ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-600 dark:text-emerald-300'
                  : 'bg-white dark:bg-[#1a2332]/25 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {lang === 'cpp' ? 'C++' : lang}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search DSA topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* TOPICS GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-white dark:bg-[#1a2332]/10 border border-slate-200 dark:border-[#1e293b]/30 animate-pulse p-6 space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1a2332]/10 border border-slate-200 dark:border-[#1e293b]/30 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h4 className="text-slate-800 dark:text-[#f0f9ff] font-bold">No topics found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try resetting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const pct = topic.progress
              ? Math.round((topic.progress.completed / topic.progress.total) * 100)
              : 0;

            return (
              <div
                key={topic.id}
                className="bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-[#1e293b]/50 p-6 rounded-xl flex flex-col justify-between hover:border-emerald-500/40 hover:scale-[1.01] transition-all group"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-[#0f1419]/80 border border-slate-200 dark:border-[#10b981]/20 rounded-xl">
                        {getTopicIcon(topic.icon)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                          {topic.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDifficultyColor(topic.difficulty_level)}`}>
                            {topic.difficulty_level}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            {topic.language === 'cpp' ? 'C++' : topic.language}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                {/* Progress & Link */}
                <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-[#1e293b]/40">
                  {/* Progress Bar */}
                  {topic.progress && topic.progress.total > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>Progress</span>
                        <span>{topic.progress.completed} / {topic.progress.total} Completed ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    href={`/learning/${topic.id}`}
                    className="w-full py-2.5 bg-slate-50 dark:bg-[#1a2332]/50 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {pct === 100 ? (
                      <>
                        <Award className="w-4 h-4 text-amber-500 group-hover:text-white" /> Review Topic
                      </>
                    ) : pct > 0 ? (
                      'Resume Learning'
                    ) : (
                      'Start Learning'
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
