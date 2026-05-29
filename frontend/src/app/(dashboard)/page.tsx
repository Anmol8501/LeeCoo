'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Code,
  Activity,
  Sparkles,
  ArrowRight,
  Flame
} from 'lucide-react';
import { questionService } from '@/services/questionService';
import { learningService } from '@/services/learningService';
import Link from 'next/link';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    solvedCount: 0,
    submissionCount: 0,
    topicsCompleted: 0,
    topicsTotal: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Fetch questions to compute solved status, and submission history
        const [questionsRes, submissionsRes, topicsRes] = await Promise.all([
          questionService.getQuestions({ limit: 100 }).catch(() => ({ questions: [], pagination: { total: 0 } })),
          questionService.getUserSubmissions(1, 100).catch(() => ({ submissions: [], pagination: { total: 0 } })),
          learningService.getTopics().catch(() => []),
        ]);

        const questions = questionsRes.questions || [];
        const solvedCount = questions.filter(q => q.user_status === 'solved' || q.status === 'solved').length;
        
        let completedTopics = 0;
        topicsRes.forEach(t => {
          if (t.progress && t.progress.completed === t.progress.total && t.progress.total > 0) {
            completedTopics++;
          }
        });

        setStats({
          solvedCount: solvedCount,
          submissionCount: submissionsRes.pagination?.total || submissionsRes.submissions?.length || 0,
          topicsCompleted: completedTopics,
          topicsTotal: topicsRes.length || 6,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* STATS OVERVIEW SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Item 1 */}
        <div className="bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-[#10b981]/20 p-6 rounded-xl transition-all hover:scale-[1.01] hover:border-emerald-500/35">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Solved</p>
              <h3 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">
                {isLoading ? '...' : stats.solvedCount}
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Practice target</span>
            <span className="text-slate-500 dark:text-slate-400">Recalculates instantly</span>
          </div>
        </div>

        {/* Stat Item 2 */}
        <div className="bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-[#10b981]/20 p-6 rounded-xl transition-all hover:scale-[1.01] hover:border-emerald-500/35">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Submissions</p>
              <h3 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">
                {isLoading ? '...' : stats.submissionCount}
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Code className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Run code logs</span>
            <span className="text-slate-500 dark:text-slate-400">Active execution tracing</span>
          </div>
        </div>

        {/* Stat Item 3 */}
        <div className="bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-[#10b981]/20 p-6 rounded-xl transition-all hover:scale-[1.01] hover:border-emerald-500/35">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topics Completed</p>
              <h3 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">
                {isLoading ? '...' : `${stats.topicsCompleted} / ${stats.topicsTotal}`}
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.topicsTotal > 0 ? Math.round((stats.topicsCompleted / stats.topicsTotal) * 100) : 0}% Complete
            </span>
            <span className="text-slate-500 dark:text-slate-400">DSA Syllabus</span>
          </div>
        </div>

        {/* Stat Item 4 */}
        <div className="bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-[#10b981]/20 p-6 rounded-xl bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent transition-all hover:scale-[1.01] hover:border-emerald-500/35">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">AI Tutor Hints</p>
              <h3 className="text-3xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">24 / 30</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Remaining</span>
            <span className="text-slate-500 dark:text-slate-400">Resets hourly</span>
          </div>
        </div>

      </div>

      {/* MAIN GRAPHICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Heatmap Section */}
        <div className="bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-[#10b981]/20 p-6 rounded-xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Activity Heatmap</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track your daily submission consistency</p>
            </div>
            <Link href="/questions" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              Solve Problems <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {/* Green Heatmap Grid */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-[#0f1419]/45 rounded-lg border border-slate-200 dark:border-[#10b981]/25">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-2">
              {Array.from({ length: 119 }).map((_, i) => {
                // Green color scale based on intensity
                const intensities = [
                  'bg-slate-200 dark:bg-[#1a2332]/40', // 0
                  'bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-500/10', // 1
                  'bg-emerald-300 dark:bg-emerald-800/50', // 2
                  'bg-emerald-500 dark:bg-emerald-600/80', // 3
                  'bg-emerald-600 dark:bg-emerald-500', // 4
                ];
                // Generate a pseudo-random activity map
                let level = 0;
                if (i % 7 === 0 || i % 13 === 0) level = 0;
                else if (i % 5 === 0) level = 1;
                else if (i % 8 === 0) level = 2;
                else if (i % 11 === 0) level = 3;
                else level = Math.floor((i % 4));

                const color = intensities[level];
                return (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-sm ${color} transition-colors duration-300 hover:ring-2 hover:ring-emerald-400 cursor-pointer`}
                    title={`Day ${i + 1}: ${level === 0 ? 'No' : level * 2} submissions`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-200 dark:border-[#10b981]/20/30">
              <span>Less active</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-[#1a2332]/40" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/40" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-800/50" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-600/80" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
              </div>
              <span>More active</span>
            </div>
          </div>
        </div>

        {/* Joined Classrooms */}
        <div className="bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-[#10b981]/20 p-6 rounded-xl space-y-6">
          <h4 className="font-bold text-base text-slate-900 dark:text-white">Joined Classrooms</h4>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50/50 dark:bg-[#1a2332]/25 border border-slate-200 dark:border-[#10b981]/20 hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">DSA Bootcamp 2026</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instructor: Dr. Alan Turing</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                  Active
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>12 Assignments</span>
                <span>45 students</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50/50 dark:bg-[#1a2332]/25 border border-slate-200 dark:border-[#10b981]/20 hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Advanced Algorithms</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instructor: Prof. Hopper</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-full border border-slate-500/20">
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
    </div>
  );
}
