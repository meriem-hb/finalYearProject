import { getModuleById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ContentViewer } from '@/components/content/ContentViewer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ListChecks, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  const module = getModuleById(params.moduleId);

  if (!module) {
    notFound();
  }

  // Placeholder for next/previous logic
  const previousModuleId = null; // e.g., getPreviousModuleId(module.id);
  const nextModuleId = null; // e.g., getNextModuleId(module.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/content">Content</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-primary">{module.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-headline font-bold text-primary mb-3">{module.title}</h1>
          <p className="text-xl text-foreground/80">{module.description}</p>
          <div className="mt-4">
            <Image
              src={module.imageUrl}
              alt={module.title}
              width={1200}
              height={400}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              data-ai-hint={module.dataAiHint}
              priority
            />
          </div>
        </header>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Module Content</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none prose-headings:text-primary prose-p:text-foreground/90 prose-img:rounded-md prose-img:shadow-sm">
            {module.content.map((item, index) => (
              <ContentViewer key={index} item={item} />
            ))}
          </CardContent>
        </Card>
      </article>

      <section className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 border-t">
        <Button variant="outline" disabled={!previousModuleId} asChild>
          {previousModuleId ? (
            <Link href={`/dashboard/content/${previousModuleId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Link>
          ) : (
            <span><ChevronLeft className="mr-2 h-4 w-4" /> Previous</span>
          )}
        </Button>
        <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
           <Link href={`/dashboard/quizzes?moduleId=${module.id}`}> {/* Link to quizzes related to this module */}
            Test Your Knowledge <ListChecks className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" disabled={!nextModuleId} asChild>
          {nextModuleId ? (
            <Link href={`/dashboard/content/${nextModuleId}`}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <span>Next <ChevronRight className="ml-2 h-4 w-4" /></span>
          )}
        </Button>
      </section>
    </div>
  );
}
