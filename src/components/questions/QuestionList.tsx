
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageSquare, Eye, AlertTriangle } from 'lucide-react';
import type { CommunityQuestion } from '@/types';
import { formatDistanceToNowStrict } from 'date-fns';
import { ar } from 'date-fns/locale';

interface QuestionListProps {
  questions: CommunityQuestion[];
}

function formatRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString);
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: ar });
  } catch (error) {
    return dateString; 
  }
}

export function QuestionList({ questions }: QuestionListProps) {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12 bg-card p-6 rounded-lg shadow">
        <AlertTriangle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد أسئلة متاحة حاليًا</h3>
        <p className="text-muted-foreground">كن أول من يطرح سؤالاً أو تحقق مرة أخرى قريبًا!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {questions.map((question, index) => {
        const contentPreview = question.content.length > 150 
          ? question.content.substring(0, 150) + '...' 
          : question.content;

        return (
          <div 
            key={question.id} 
            className={`flex flex-row items-start p-4 bg-card ${index < questions.length -1 ? 'border-b border-border' : ''} hover:bg-muted/50 transition-colors duration-150`}
          >
            <div className="flex flex-col items-center space-y-2 w-20 ltr:mr-4 rtl:ml-4 text-xs text-muted-foreground shrink-0">
              <div className="flex flex-col items-center">
                <span className="font-semibold text-sm text-foreground">{question.votes}</span>
                <span>تصويت</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-sm text-foreground">{question.answersCount}</span>
                <span>اجابة</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-sm text-foreground">{question.views}</span>
                <span>مشاهدة</span>
              </div>
            </div>

            <div className="flex-grow space-y-1.5 text-right">
              <h3 className="text-lg font-semibold text-primary hover:underline">
                <Link href={`/dashboard/questions/${question.id}`}>{question.title}</Link>
              </h3>
              <p className="text-sm text-foreground/80 line-clamp-2">{contentPreview}</p>
              
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1 justify-end">
                  {question.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">#{tag}</Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs text-muted-foreground pt-1.5">
                {question.subject && <span>مادة: <span className="font-medium text-foreground/90">{question.subject}</span></span>}
                {question.gradeLevel && <span>مرحلة دراسية: <span className="font-medium text-foreground/90">{question.gradeLevel}</span></span>}
                <span>الوقت: <span className="font-medium text-foreground/90">{formatRelativeTime(question.createdAt)}</span></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

