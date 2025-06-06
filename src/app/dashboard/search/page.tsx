
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  if (!query) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please enter a search term in the header search bar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">لوحة التحكم</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-primary">نتائج البحث</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section>
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">
          نتائج البحث عن: <span className="text-accent">&quot;{query}&quot;</span>
        </h1>
        <p className="text-lg text-foreground/80">
          يتم حاليًا عرض نتائج البحث الخاصة بك. سيتم تحديث هذه الصفحة بالنتائج الفعلية قريبًا.
        </p>
      </section>

      <Card className="mt-8 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3">
          <SearchIcon className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl text-primary">Results</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for actual search results */}
          <div className="py-10 text-center">
            <p className="text-muted-foreground">
              سيتم عرض نتائج البحث هنا...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
