'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { learningService, Topic, Subtopic } from '@/services/learningService';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award
} from 'lucide-react';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [activeSubtopic, setActiveSubtopic] = useState<Subtopic | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    async function loadTopic() {
      try {
        const data = await learningService.getTopicById(topicId);
        setTopic(data);
        if (data.subtopics && data.subtopics.length > 0) {
          // Find first uncompleted subtopic, or fallback to the first subtopic
          const firstUncompleted = data.subtopics.find(s => !s.is_completed);
          setActiveSubtopic(firstUncompleted || data.subtopics[0]);
        }
      } catch (err) {
        console.error('Failed to load topic details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTopic();
  }, [topicId]);

  const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const handleToggleCompletion = async (subtopic: Subtopic) => {
    if (isUpdating || !topic) return;
    setIsUpdating(true);
    
    const wasCompleted = !!subtopic.is_completed;
    try {
      if (wasCompleted) {
        await learningService.unmarkSubtopicComplete(subtopic.id);
      } else {
        await learningService.markSubtopicComplete(subtopic.id);
      }

      // Refresh topic details to update progress and state
      const updatedTopic = await learningService.getTopicById(topicId);
      setTopic(updatedTopic);
      
      // Update local subtopic state
      const updatedSubtopic = updatedTopic.subtopics?.find(s => s.id === subtopic.id);
      if (updatedSubtopic) {
        setActiveSubtopic(updatedSubtopic);

        // Auto-advance to the next subtopic if we just completed this one
        if (!wasCompleted && updatedTopic.subtopics) {
          const currentIndex = updatedTopic.subtopics.findIndex(s => s.id === subtopic.id);
          if (currentIndex !== -1 && currentIndex < updatedTopic.subtopics.length - 1) {
            setTimeout(() => {
              setActiveSubtopic(updatedTopic.subtopics![currentIndex + 1]);
            }, 800);
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle completion:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] dark:bg-[#07090e] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 dark:text-slate-400 text-sm">Loading lesson workspace...</span>
        </div>
      </div>
    );
  }

  if (!topic || !activeSubtopic) {
    return (
      <div className="p-8 text-center bg-[#f8fafc] dark:bg-[#07090e] min-h-[calc(100vh-64px)]">
        <h3 className="text-slate-800 dark:text-white font-bold">Topic not found</h3>
        <Link href="/learning" className="mt-4 inline-block text-emerald-500 hover:underline">
          Back to learning paths
        </Link>
      </div>
    );
  }

  const embedUrl = getYoutubeEmbedUrl(activeSubtopic.video_url);
  const totalSubtopics = topic.subtopics?.length || 0;
  const completedSubtopics = topic.subtopics?.filter(s => s.is_completed).length || 0;
  const completionPercentage = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-[#07090e]">
      
      {/* LEFT SIDEBAR: SUBTOPIC LISTING */}
      <aside className="w-80 border-r border-slate-200 dark:border-[#1e293b]/70 bg-white dark:bg-[#0a0f1d] flex flex-col justify-between shrink-0 h-full">
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header Back Button */}
          <div className="p-4 border-b border-slate-100 dark:border-[#1e293b]/40">
            <Link href="/learning" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Learning Paths
            </Link>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mt-3 truncate" title={topic.title}>
              {topic.title}
            </h3>
            
            {/* Progress metrics */}
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                <span>COURSE COMPLETION</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Subtopics Scroll List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {topic.subtopics?.map((sub, idx) => {
              const isActiveSub = sub.id === activeSubtopic.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubtopic(sub)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all border cursor-pointer ${
                    isActiveSub
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                      : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a2332]/20 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0" onClick={(e) => { e.stopPropagation(); handleToggleCompletion(sub); }}>
                    {sub.is_completed ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-4.5 h-4.5 text-slate-400 dark:text-slate-600 hover:text-emerald-500 transition-colors" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold leading-tight ${isActiveSub ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-350'}`}>
                      {idx + 1}. {sub.title}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
                      {sub.video_url ? <Play className="w-2.5 h-2.5 inline" /> : <FileText className="w-2.5 h-2.5 inline" />}
                      {sub.video_url ? 'Video lesson' : 'Notes only'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Completion status reward block */}
        {completionPercentage === 100 && (
          <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border-t border-emerald-500/20 text-center space-y-2">
            <Award className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-[#f0f9ff]">Topic Completed!</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Great job! You have completed all lessons in this topic.</p>
          </div>
        )}
      </aside>

      {/* RIGHT SIDE: STUDY WORKSPACE (VIDEO & NOTES) */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#07090e] h-full">
        
        {/* Lesson Video Section */}
        {embedUrl && (
          <div className="bg-black aspect-video w-full max-h-[400px] border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
            <iframe
              src={embedUrl}
              title={activeSubtopic.title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Notes Content Section */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8">
          <div>
            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-450 text-[10px] font-bold rounded uppercase tracking-wider">
              {topic.title}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {activeSubtopic.title}
            </h1>
          </div>

          {/* Notes body (Formatted HTML/Markdown) */}
          <article className="prose dark:prose-invert prose-emerald max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: activeSubtopic.content }}
            />
          </article>

          {/* Complete Lesson Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-[#1e293b]/40">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleToggleCompletion(activeSubtopic)}
                disabled={isUpdating}
                className={`px-6 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 ${
                  activeSubtopic.is_completed
                    ? 'bg-slate-100 dark:bg-[#1a2332] text-slate-700 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-[#1a2332]/80 border border-slate-200 dark:border-[#10b981]/20'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10 hover:shadow-emerald-500/20'
                }`}
              >
                {activeSubtopic.is_completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completed (Undo)
                  </>
                ) : (
                  <>
                    Mark Lesson as Completed <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            
            {/* Nav Arrows */}
            <div className="flex items-center gap-2">
              {topic.subtopics && (
                <>
                  {topic.subtopics.findIndex(s => s.id === activeSubtopic.id) > 0 && (
                    <button
                      onClick={() => {
                        const idx = topic.subtopics!.findIndex(s => s.id === activeSubtopic.id);
                        setActiveSubtopic(topic.subtopics![idx - 1]);
                      }}
                      className="p-2 border border-slate-200 dark:border-[#1e293b]/50 hover:border-emerald-500 hover:text-emerald-500 rounded-lg text-slate-500 dark:text-slate-400 bg-white dark:bg-transparent cursor-pointer"
                      title="Previous Lesson"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {topic.subtopics.findIndex(s => s.id === activeSubtopic.id) < topic.subtopics.length - 1 && (
                    <button
                      onClick={() => {
                        const idx = topic.subtopics!.findIndex(s => s.id === activeSubtopic.id);
                        setActiveSubtopic(topic.subtopics![idx + 1]);
                      }}
                      className="p-2 border border-slate-200 dark:border-[#1e293b]/50 hover:border-emerald-500 hover:text-emerald-500 rounded-lg text-slate-500 dark:text-slate-400 bg-white dark:bg-transparent cursor-pointer"
                      title="Next Lesson"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
