'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { learningService } from '@/services/learningService';

export default function ContinueLearningRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      try {
        const continueTopics = await learningService.getContinueLearning();
        if (continueTopics && continueTopics.length > 0) {
          router.replace(`/learning/${continueTopics[0].id}`);
        } else {
          router.replace('/learning');
        }
      } catch (err) {
        console.error('Redirect failed:', err);
        router.replace('/learning');
      }
    }
    redirect();
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8fafc] dark:bg-[#07090e]">
      <div className="flex flex-col items-center gap-2 animate-pulse">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Finding your last lesson...</span>
      </div>
    </div>
  );
}
