
'use client';

import { SubjectCard } from '@/components/content/SubjectCard';
import { mockSubjectCategories } from '@/lib/mock-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from '@/components/ui/card';

const gradeLevels = ["الثانية ثانوي", "الأولى ثانوي", "الثالثة ثانوي", "تعليم أساسي", "بكالوريا"];


export default function ContentCategoriesPage() {
  const subjects = mockSubjectCategories;

  return (
    <div className="space-y-8" dir="rtl">
      <section className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary">المواد</h1>
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Select dir="rtl">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="المرحلة الدراسية" />
            </SelectTrigger>
            <SelectContent>
              {gradeLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </section>

      {subjects.length > 0 ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </section>
      ) : (
         <Card className="p-10 text-center">
            <p className="text-lg text-muted-foreground">لا توجد مواد متاحة حاليًا.</p>
        </Card>
      )}
    </div>
  );
}
