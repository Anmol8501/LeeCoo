'use client';

import React, { useState, useEffect } from 'react';
import { questionService, Question } from '@/services/questionService';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  CircleAlert,
  ChevronRight,
  Code2,
  BookOpen
} from 'lucide-react';

export default function QuestionsListPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    total_pages: 1
  });

  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);
      try {
        const difficulty = difficultyFilter === 'all' ? undefined : difficultyFilter;
        const res = await questionService.getQuestions({
          page: pagination.page,
          limit: pagination.limit,
          difficulty,
          search: searchQuery || undefined
        });

        // Filter by solved status locally if needed
        let filteredQuestions = res.questions || [];
        if (statusFilter === 'solved') {
          filteredQuestions = filteredQuestions.filter(q => q.user_status === 'solved' || q.status === 'solved');
        } else if (statusFilter === 'unattempted') {
          filteredQuestions = filteredQuestions.filter(q => q.user_status !== 'solved' && q.status !== 'solved');
        }

        setQuestions(filteredQuestions);
        setPagination(prev => ({
          ...prev,
          total: res.pagination?.total || filteredQuestions.length,
          total_pages: res.pagination?.total_pages || 1
        }));
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, [difficultyFilter, statusFilter, searchQuery, pagination.page, pagination.limit]);

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
      {/* FILTER & SEARCH ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1e293b]/50">
        
        {/* Dropdowns */}
        <div className="flex flex-wrap gap-3">
          {/* Difficulty */}
          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value);
              setPagination(p => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Solved Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(p => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="solved">Solved</option>
            <option value="unattempted">Todo</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination(p => ({ ...p, page: 1 }));
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
          />
        </div>

      </div>

      {/* QUESTIONS LIST TABLE */}
      {isLoading ? (
        <div className="bg-white dark:bg-[#1a2332]/10 border border-slate-200 dark:border-[#1e293b]/30 rounded-xl overflow-hidden animate-pulse">
          <div className="h-12 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 border-b border-slate-200 dark:border-slate-700/50 flex items-center px-6 gap-6">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16 ml-auto" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12" />
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1a2332]/10 border border-slate-200 dark:border-[#1e293b]/30 rounded-2xl">
          <Code2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h4 className="text-slate-800 dark:text-[#f0f9ff] font-bold">No questions found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try relaxing your search terms or filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1a2332]/25 border border-slate-200 dark:border-[#1e293b]/50 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#1a2332]/45 border-b border-slate-200 dark:border-[#1e293b]/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6 w-16 text-center">Status</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4 w-28">Difficulty</th>
                  <th className="py-3.5 px-4 w-32">Acceptance</th>
                  <th className="py-3.5 px-6 w-24 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1e293b]/30 text-xs">
                {questions.map((q) => {
                  const isSolved = q.user_status === 'solved' || q.status === 'solved';
                  return (
                    <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-[#1a2332]/15 transition-colors">
                      <td className="py-4 px-6 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto fill-emerald-500/10" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/questions/${q.id}`}
                          className="font-semibold text-slate-800 dark:text-slate-250 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {q.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium">
                        {q.acceptance_rate}%
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/questions/${q.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                        >
                          Solve <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {pagination.total_pages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 dark:bg-[#1a2332]/45 border-t border-slate-200 dark:border-[#1e293b]/50">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Total Problems: {pagination.total}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:border-emerald-500 hover:text-emerald-500 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Prev
                </button>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <button
                  disabled={pagination.page === pagination.total_pages}
                  onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:border-emerald-500 hover:text-emerald-500 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
