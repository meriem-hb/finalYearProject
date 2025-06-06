
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getQuestions, addAnswer, getAnswers } from '@/lib/data';
import { getCurrentUser, FirebaseAuthUser } from '@/lib/auth';
import type { CommunityQuestion, Answer } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader2, AlertTriangle, MessageSquareText, ThumbsUp, ThumbsDown, UserCircle, Edit3, Trash2 } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';


function formatRelativeTime(dateString: string | undefined) {
  if (!dateString) return 'غير معروف';
  try {
    const date = new Date(dateString);
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: ar });
  } catch (error) {
    return dateString; 
  }
}

function QuestionDetailPageContent() {
  const params = useParams<{ questionId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const questionId = params.questionId;

  const [question, setQuestion] = useState<CommunityQuestion | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    async function fetchQuestionData() {
      if (!questionId) {
        setError("معرف السؤال غير موجود.");
        setIsLoadingQuestion(false);
        setIsLoadingAnswers(false);
        return;
      }
      setIsLoadingQuestion(true);
      setError(null);
      try {
        const allQuestions = await getQuestions(); // In a real app, getQuestionById(questionId)
        const foundQuestion = allQuestions.find(q => q.id === questionId);
        
        if (foundQuestion) {
          setQuestion(foundQuestion);
        } else {
          setError(`لم يتم العثور على السؤال بالمعرف: ${questionId}`);
          // notFound(); // Use this to render Next.js 404 page
        }
      } catch (e) {
        console.error("Failed to fetch question details:", e);
        setError("فشل في تحميل تفاصيل السؤال.");
      } finally {
        setIsLoadingQuestion(false);
      }
    }

    async function fetchAnswersData() {
      if (!questionId) return;
      setIsLoadingAnswers(true);
      try {
        const fetchedAnswers = await getAnswers(questionId);
        setAnswers(fetchedAnswers);
      } catch (e) {
        console.error("Failed to fetch answers:", e);
        // Optionally set a specific error for answers
      } finally {
        setIsLoadingAnswers(false);
      }
    }

    fetchQuestionData();
    fetchAnswersData();
  }, [questionId]);

  const refreshAnswers = async () => {
    if (!questionId) return;
    setIsLoadingAnswers(true);
    try {
      const fetchedAnswers = await getAnswers(questionId);
      setAnswers(fetchedAnswers);
    } catch (e) {
      console.error("Failed to refresh answers:", e);
      toast({ title: "خطأ", description: "فشل في تحديث قائمة الإجابات.", variant: "destructive" });
    } finally {
      setIsLoadingAnswers(false);
    }
  };


  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) {
      toast({ title: "تنبيه", description: "لا يمكن إرسال إجابة فارغة.", variant: "default" });
      return;
    }
    if (!currentUser) {
        toast({ title: "خطأ", description: "يجب تسجيل الدخول لتقديم إجابة.", variant: "destructive" });
        return;
    }
    if (!question) {
        toast({ title: "خطأ", description: "السؤال غير متوفر لتقديم إجابة.", variant: "destructive" });
        return;
    }

    setIsSubmittingAnswer(true);
    
    const answerData = {
      content: newAnswer,
      authorId: currentUser.uid,
      authorName: currentUser.displayName || currentUser.email || "مستخدم مجهول",
      authorPhotoURL: currentUser.photoURL || null,
    };

    const newAnswerId = await addAnswer(question.id, answerData);

    if (newAnswerId) {
      toast({ title: "نجاح!", description: "تمت إضافة إجابتك." });
      setNewAnswer('');
      await refreshAnswers(); // Re-fetch answers to show the new one
       // Update question's answersCount locally for immediate feedback, or re-fetch question
       if (question) {
        setQuestion(prev => prev ? ({ ...prev, answersCount: prev.answersCount + 1 }) : null);
      }
    } else {
      toast({ title: "خطأ", description: "لم نتمكن من إضافة إجابتك. حاول مرة أخرى.", variant: "destructive" });
    }
    setIsSubmittingAnswer(false);
  };

  if (isLoadingQuestion) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جار تحميل السؤال...</p>
      </div>
    );
  }

  if (error && !question) { 
    return (
      <div className="space-y-8 p-4 md:p-6 text-center" dir="rtl">
         <Breadcrumb className="justify-center">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">لوحة التحكم</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard/questions">الأسئلة</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="font-medium text-destructive">سؤال غير موجود</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="p-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-4">سؤال غير موجود</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild variant="outline">
            <Link href="/dashboard/questions">العودة إلى قائمة الأسئلة</Link>
          </Button>
        </Card>
      </div>
    );
  }
  
  if (!question) { 
    notFound(); 
    return null; 
  }

  const questionAuthorInitial = question.authorName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-6" dir="rtl">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">لوحة التحكم</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard/questions">الأسئلة</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage className="font-medium text-primary truncate max-w-xs sm:max-w-sm md:max-w-md">{question.title}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl md:text-3xl font-headline text-primary leading-tight">
            {question.title}
          </CardTitle>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={question.authorPhotoURL || undefined} alt={question.authorName} />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">{questionAuthorInitial}</AvatarFallback>
              </Avatar>
              <Link href={`/dashboard/profile/${question.authorId}`} className="hover:underline font-medium text-foreground/90">
                {question.authorName}
              </Link>
              <span>&bull;</span>
              <span>طرح {formatRelativeTime(question.createdAt)}</span>
            </div>
            {currentUser?.uid === question.authorId && (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                        <Edit3 className="h-4 w-4" /> <span className="sr-only">تعديل السؤال</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" /> <span className="sr-only">حذف السؤال</span>
                    </Button>
                </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base max-w-none prose-p:text-foreground/90 whitespace-pre-wrap pt-0 pb-4">
          {question.content}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t">
          <div className="flex flex-wrap gap-2">
            {question.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">#{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button variant="ghost" size="sm" className="px-2 py-1 h-auto text-xs hover:bg-muted">
              <ThumbsUp className="rtl:ml-1 ltr:mr-1 h-4 w-4" /> {question.votes} تصويت
            </Button>
            <Button variant="ghost" size="sm" className="px-2 py-1 h-auto text-xs hover:bg-muted">
                <ThumbsDown className="rtl:ml-1 ltr:mr-1 h-4 w-4" />
            </Button>
            <span className="text-xs">{question.views} مشاهدة</span>
            <span className="text-xs">{question.answersCount} إجابات</span>
          </div>
        </CardFooter>
      </Card>

      <Separator />

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          {isLoadingAnswers ? (
            <Loader2 className="inline rtl:ml-2 ltr:mr-2 h-5 w-5 animate-spin" />
          ) : (
            `${answers.length} إجابة`
          )}
          {answers.length === 0 && !isLoadingAnswers && ' (لا توجد إجابات بعد)'}
        </h2>

        {currentUser && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-headline text-primary flex items-center">
                <MessageSquareText className="rtl:ml-2 ltr:mr-2 h-5 w-5" />
                أضف إجابتك
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleAnswerSubmit}>
              <CardContent>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="اكتب إجابتك هنا بوضوح وتفصيل..."
                  rows={6}
                  className="text-base"
                />
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" disabled={isSubmittingAnswer || !newAnswer.trim()} className="min-w-[120px]">
                  {isSubmittingAnswer && <Loader2 className="rtl:ml-2 ltr:mr-2 h-4 w-4 animate-spin" />}
                  {isSubmittingAnswer ? 'جار الإرسال...' : 'إرسال الإجابة'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
        {!currentUser && (
             <Card className="shadow-md p-6 text-center bg-muted/50">
                <p className="text-muted-foreground">
                    <Link href="/login" className="text-primary hover:underline font-medium">سجل الدخول</Link> أو <Link href="/signup" className="text-primary hover:underline font-medium">أنشئ حسابًا</Link> للمساهمة بإجابة.
                </p>
            </Card>
        )}

        {isLoadingAnswers ? (
          <div className="text-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground mt-2">جار تحميل الإجابات...</p>
          </div>
        ) : answers.length > 0 ? (
          answers.map(answer => {
            const answerAuthorInitial = answer.authorName?.charAt(0)?.toUpperCase() || '?';
            return (
            <Card key={answer.id} className={`shadow-sm ${answer.isAccepted ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/10' : ''}`}>
                <CardHeader className="pb-2">
                 <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={answer.authorPhotoURL || undefined} alt={answer.authorName} />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">{answerAuthorInitial}</AvatarFallback>
                    </Avatar>
                    <Link href={`/dashboard/profile/${answer.authorId}`} className="hover:underline font-medium text-foreground/90">
                        {answer.authorName}
                    </Link>
                    <span>&bull;</span>
                    <span>أجاب {formatRelativeTime(answer.createdAt)}</span>
                    </div>
                    {answer.isAccepted && <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white text-xs">إجابة مقبولة</Badge>}
                 </div>
                 {currentUser?.uid === answer.authorId && !answer.isAccepted && (
                     <div className="flex gap-1 mt-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
                            <Edit3 className="h-3.5 w-3.5" /> <span className="sr-only">تعديل الإجابة</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> <span className="sr-only">حذف الإجابة</span>
                        </Button>
                    </div>
                 )}
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none prose-p:text-foreground/80 whitespace-pre-wrap pt-0 pb-3">
                {answer.content}
                </CardContent>
                <CardFooter className="flex justify-start items-center gap-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="px-2 py-1 h-auto text-xs text-muted-foreground hover:bg-muted">
                        <ThumbsUp className="rtl:ml-1 ltr:mr-1 h-4 w-4" /> {answer.votes}
                    </Button>
                    <Button variant="ghost" size="sm" className="px-2 py-1 h-auto text-xs text-muted-foreground hover:bg-muted">
                        <ThumbsDown className="rtl:ml-1 ltr:mr-1 h-4 w-4" />
                    </Button>
                    {currentUser?.uid === question.authorId && currentUser.uid !== answer.authorId && !answer.isAccepted && (
                        <Button variant="outline" size="sm" className="px-2 py-1 h-auto text-xs border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                            قبول كأفضل إجابة
                        </Button>
                    )}
                </CardFooter>
            </Card>
            );
          })
        ) : (
          !isLoadingQuestion && <p className="text-muted-foreground text-center py-6">كن أول من يجيب على هذا السؤال!</p>
        )}
      </section>
    </div>
  );
}


export default function QuestionDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <QuestionDetailPageContent />
    </Suspense>
  );
}
