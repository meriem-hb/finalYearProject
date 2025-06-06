
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

interface EdumentorLogoProps {
  className?: string;
}

export function EdumentorLogo({ className = '' }: EdumentorLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <BookOpen className="h-8 w-8 text-primary" />
      <span className={`font-headline font-bold text-2xl`}>
        <span className="text-primary">Edu</span>
        <span className="text-foreground">mentor</span>
      </span>
    </Link>
  );
}
