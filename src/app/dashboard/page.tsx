
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { onAuthUserProfileChanged } from '@/lib/auth';
import type { AppUser, CommunityQuestion } from '@/types';
import { QuestionList } from '@/components/questions/QuestionList';
import { getQuestions } from '@/lib/data'; 
import Link from 'next/link';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [dashboardQuestions, setDashboardQuestions] = useState<CommunityQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthUserProfileChanged((user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });

    async function fetchDashboardQuestions() {
      setIsLoadingQuestions(true);
      try {
        const questions = await getQuestions(); 
        setDashboardQuestions(questions); 
      } catch (error) {
        console.error("Failed to fetch dashboard questions", error);
        // Optionally, set an error state here to display to the user
      } finally {
        setIsLoadingQuestions(false);
      }
    }

    fetchDashboardQuestions();
    
    return () => {
      unsubscribeAuth();
    };
  }, []);


  if (isLoadingAuth || isLoadingQuestions) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جار التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6" dir="rtl">
      <section className="flex justify-between items-center mb-8">
        {currentUser && (
          <h1 className="text-2xl font-semibold text-foreground">
            مرحباً بك في Edumentor، <span className="text-primary">{currentUser.displayName || currentUser.username || 'متعلم'}</span>!
          </h1>
        )}
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3 shadow-md" asChild>
          <Link href="/dashboard/ask-question">
            <PlusCircle className="rtl:ml-2 ltr:mr-2 h-5 w-5" />
            اطرح سؤالاً
          </Link>
        </Button>
      </section>

      <section>
        <QuestionList questions={dashboardQuestions} />
      </section>
    </div>
  );
}
