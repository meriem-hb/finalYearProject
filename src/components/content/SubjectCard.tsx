
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { SubjectCategory } from '@/types';
import * as LucideIcons from 'lucide-react';

interface SubjectCardProps {
  subject: SubjectCategory;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const IconComponent = (LucideIcons as any)[subject.iconName] || LucideIcons.Book; // Fallback icon

  return (
    <Link href={`/dashboard/content/subject/${subject.id}`} passHref legacyBehavior>
      <a className="block group">
        <Card className="h-full flex flex-col items-center justify-center text-center p-4 shadow-md hover:shadow-lg transition-shadow duration-200 hover:border-primary">
          <CardHeader className="p-2">
            <IconComponent className="h-12 w-12 text-primary mb-2 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent className="p-2 flex-grow flex flex-col justify-center">
            <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors">{subject.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{subject.questionCount} مجموع اسئلة</p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}

