import { QuizCard } from '@/components/quizzes/QuizCard';
import { mockQuizzes } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function QuizzesListPage() {
  // In a real app, quizzes would be fetched and could be filtered/searched
  const quizzes = mockQuizzes;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Interactive Quizzes</h1>
        <p className="text-lg text-foreground/80">Test your understanding and solidify your learning.</p>
      </section>
      
      <section className="sticky top-14 md:top-0 z-20 py-4 bg-background/95 backdrop-blur">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search quizzes..." className="pl-10 w-full md:w-1/2 lg:w-1/3" />
          </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </section>
      {quizzes.length === 0 && (
        <p className="text-center text-lg text-foreground/70 py-10">No quizzes available at the moment. Check back soon!</p>
      )}
    </div>
  );
}
