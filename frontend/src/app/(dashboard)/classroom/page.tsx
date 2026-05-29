'use client';

import React from 'react';
import { Users, BookOpen, Clock, PlayCircle } from 'lucide-react';

export default function ClassroomsPage() {
  const classrooms = [
    {
      name: 'DSA Bootcamp 2026',
      instructor: 'Dr. Alan Turing',
      assignmentsCount: 12,
      studentsCount: 45,
      active: true,
      code: 'CS2026-DSA',
    },
    {
      name: 'Advanced Algorithms & Complexity',
      instructor: 'Prof. Grace Hopper',
      assignmentsCount: 6,
      studentsCount: 32,
      active: false,
      code: 'CS2026-ADV',
    }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classrooms.map((cls, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1a2332]/35 border border-slate-200 dark:border-[#1e293b]/50 p-6 rounded-xl hover:border-emerald-500/40 hover:scale-[1.01] transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">
                      {cls.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Code: {cls.code} • Instructor: {cls.instructor}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  cls.active
                    ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-slate-450 bg-slate-500/10 dark:text-slate-400 border-slate-800'
                }`}>
                  {cls.active ? 'Active' : 'Archived'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-[#1e293b]/40 text-xs text-slate-500 dark:text-slate-450">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span>{cls.assignmentsCount} Assignments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>{cls.studentsCount} Enrolled Students</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                disabled={!cls.active}
                className="w-full py-2 bg-slate-50 dark:bg-[#1a2332]/50 hover:bg-emerald-500 hover:text-white border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg text-center transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:hover:bg-slate-50 disabled:hover:text-slate-705"
              >
                <PlayCircle className="w-4 h-4" /> Enter Classroom Workspace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
