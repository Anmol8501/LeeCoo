'use client';

import React from 'react';
import { FileText, Award, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CuratedSheetsPage() {
  const sheets = [
    {
      title: 'NeetCode 150',
      description: 'The most popular curated list of 150 DSA questions for tech interviews.',
      count: 150,
      completed: 15,
      difficulty: 'All levels',
      badge: 'Popular',
    },
    {
      title: 'Blind 75',
      description: 'The classic LeetCode sheet compiled by tech industry veterans.',
      count: 75,
      completed: 30,
      difficulty: 'Medium focus',
      badge: 'Classic',
    },
    {
      title: 'SDE Core Cheat Sheet',
      description: 'Crucial topics and coding paradigms for Software Development Engineer interviews.',
      count: 90,
      completed: 0,
      difficulty: 'Advanced',
      badge: 'Comprehensive',
    },
    {
      title: 'Arrays & Hashing Starter Pack',
      description: 'Start your coding journey with core fundamentals on Arrays.',
      count: 20,
      completed: 20,
      difficulty: 'Easy',
      badge: 'Completed',
    }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sheets.map((sheet, index) => {
          const pct = Math.round((sheet.completed / sheet.count) * 100);
          return (
            <div
              key={index}
              className="bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-[#1e293b]/50 p-6 rounded-xl hover:border-emerald-500/40 hover:scale-[1.01] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                        {sheet.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                        {sheet.difficulty} • {sheet.count} Problems
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    sheet.badge === 'Completed'
                      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-slate-500 bg-slate-500/10 dark:text-slate-450 border-slate-800'
                  }`}>
                    {sheet.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {sheet.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1e293b]/40 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Progress</span>
                    <span>{sheet.completed} / {sheet.count} Solved ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <Link
                  href="/questions"
                  className="w-full py-2 bg-slate-50 dark:bg-[#1a2332]/50 hover:bg-emerald-500 hover:text-white border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  {pct === 100 ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-500 group-hover:text-white" /> Sheet Completed
                    </>
                  ) : (
                    <>
                      Start Solving <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
