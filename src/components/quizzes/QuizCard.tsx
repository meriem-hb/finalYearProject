import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Quiz } from '@/types';
import { FileQuestion, ListChecks } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <FileQuestion className="h-6 w-6 text-accent" />
          <CardTitle className="font-headline text-xl text-primary">{quiz.title}</CardTitle>
        </div>
        <CardDescription className="h-12 line-clamp-2">{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <ListChecks className="mr-1.5 h-4 w-4" />
          <span>{quiz.questions.length} Questions</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/dashboard/quizzes/${quiz.id}`}>
            Start Quiz
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
