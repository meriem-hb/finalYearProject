
'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { mockSubjectCategories } from '@/lib/mock-data';
import type { SubjectCategory } from '@/types';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SubjectDetailPage() {
  const params = useParams<{ subjectId: string }>();
  const subjectId = params.subjectId;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectInfo, setSubjectInfo] = useState<SubjectCategory | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    if (!subjectId) {
      setError("معرف المادة غير موجود في الرابط.");
      setIsLoading(false);
      return;
    }

    const foundSubject = mockSubjectCategories.find(s => s.id === subjectId);

    if (foundSubject) {
      setSubjectInfo(foundSubject);
    } else {
      setError(`لم يتم العثور على المادة بالمعرف: ${subjectId}`);
      // In a real app, you might call notFound() here if the subject is critical
      // notFound(); 
    }
    setIsLoading(false);
  }, [subjectId]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جار تحميل معلومات المادة...</p>
      </div>
    );
  }

  if (!subjectInfo) { // Handles both explicit error state or if subjectInfo remained null
    return (
      <div className="space-y-8 p-4 md:p-6 text-center" dir="rtl">
        <Breadcrumb className="justify-center">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">لوحة التحكم</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/content">المواد</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-destructive">
                مادة غير معروفة
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="p-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-4">مادة غير موجودة</h1>
          <p className="text-muted-foreground mb-6">{error || `المادة المطلوبة (${subjectId}) غير متوفرة أو أن الرابط غير صحيح.`}</p>
          <Button asChild variant="outline">
            <Link href="/dashboard/content">العودة إلى قائمة المواد</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // General error set during fetch (e.g., subjectId missing at start)
  if (error && !subjectInfo) { // Only show this generic error if subjectInfo is still not found
    return (
        <div className="space-y-8 p-4 md:p-6 text-center" dir="rtl">
            <Breadcrumb className="justify-center">
                 <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                        <Link href="/dashboard">لوحة التحكم</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                        <Link href="/dashboard/content">المواد</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                     <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-medium text-destructive">
                         خطأ
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className="p-10">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                 <h1 className="text-2xl font-bold text-destructive mb-4">خطأ في عرض الصفحة</h1>
                <p className="text-destructive">{error}</p>
                 <Button asChild variant="outline" className="mt-4">
                    <Link href="/dashboard/content">العودة إلى قائمة المواد</Link>
                </Button>
            </Card>
        </div>
    );
  }
  

  return (
    <div className="space-y-8 p-4 md:p-6" dir="rtl">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">لوحة التحكم</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/content">المواد</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-primary">
              {subjectInfo.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="text-center py-8">
        <h1 className="text-5xl font-headline font-bold text-primary mb-10">
          {subjectInfo.name}
        </h1>
        <div className="flex justify-center items-center gap-6">
          <Button variant="outline" size="lg" className="px-10 py-3 text-lg hover:bg-primary/10 hover:text-primary hover:border-primary">
            الدروس
          </Button>
          <Button variant="default" size="lg" className="px-10 py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
            التمارين
          </Button>
        </div>
      </section>

      {/* Content related to الدروس or التمارين will be displayed here based on future interactions */}
      <div className="pt-8">
        {/* Placeholder for content, e.g., list of lessons or exercises */}
        {/* <p className="text-center text-muted-foreground">اختر "الدروس" أو "التمارين" لعرض المحتوى.</p> */}
      </div>
    </div>
  );
}
