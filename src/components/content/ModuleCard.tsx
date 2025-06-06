import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Module } from '@/types';
import { Clock } from 'lucide-react';

interface ModuleCardProps {
  module: Module;
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Image
        src={module.imageUrl}
        alt={module.title}
        width={600}
        height={400}
        className="w-full h-48 object-cover"
        data-ai-hint={module.dataAiHint}
      />
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary">{module.title}</CardTitle>
        <CardDescription className="h-12 line-clamp-2">{module.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1.5 h-4 w-4" />
          <span>{module.estimatedTime}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/dashboard/content/${module.id}`}>
            View Module
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
