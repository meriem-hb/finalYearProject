
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertTriangle, Filter, RefreshCw } from "lucide-react";
import { QuestionList } from '@/components/questions/QuestionList';
import { getQuestions } from '@/lib/data';
import type { CommunityQuestion } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

// Consistent options with ask-question page, plus "All"
const gradeLevelFilterOptions = ["الكل", "الثانية ثانوي", "الأولى ثانوي", "الثالثة ثانوي", "بكالوريا", "تعليم أساسي"];
const subjectFilterOptions = ["الكل", "رياضيات", "فيزياء", "علوم طبيعية", "أدب عربي", "تاريخ وجغرافيا", "فلسفة", "لغة انجليزية", "لغة فرنسية", "إعلام آلي", "تسيير واقتصاد"];

// Placeholder options for other filters (non-functional for now)
const questionTypes = ["سؤال مباشر", "طلب مساعدة", "نقاش", "استفسار"];
const tagsOptions = ["جبر", "هندسة", "ميكانيك", "كهرباء", "وراثة"];


export default function QuestionsPage() {
  const [allQuestions, setAllQuestions] = useState<CommunityQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>("الكل");
  const [selectedSubject, setSelectedSubject] = useState<string>("الكل");
  // Add states for other filters if/when they become functional
  // const [selectedQuestionType, setSelectedQuestionType] = useState<string>("الكل");
  // const [selectedTag, setSelectedTag] = useState<string>("الكل");

  const fetchAllQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await getQuestions();
      setAllQuestions(fetchedQuestions);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setError("فشل في تحميل الأسئلة. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(question => {
      const gradeMatch = selectedGradeLevel === "الكل" || question.gradeLevel === selectedGradeLevel;
      const subjectMatch = selectedSubject === "الكل" || question.subject === selectedSubject;
      // Add other filter conditions here when implemented
      return gradeMatch && subjectMatch;
    });
  }, [allQuestions, selectedGradeLevel, selectedSubject]);

  return (
    <div className="space-y-8 p-4 md:p-6" dir="rtl">
      <section>
        <h1 className="text-3xl font-headline font-bold text-primary mb-6 text-center">
          أحدث الأسئلة
        </h1>
      </section>

      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="text-foreground">
                <Filter className="ml-2 h-4 w-4" />
                تصفية
              </Button>
              <Button variant="ghost" className="hover:bg-muted text-muted-foreground">الأحدث</Button>
              <Button variant="ghost" className="hover:bg-muted text-muted-foreground">نشطة</Button>
              <Button variant="ghost" className="hover:bg-muted text-muted-foreground">بدون اجابة</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select dir="rtl" value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="المرحلة دراسية" />
              </SelectTrigger>
              <SelectContent>
                {gradeLevelFilterOptions.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select dir="rtl" value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="مادة / موضوع" />
              </SelectTrigger>
              <SelectContent>
                {subjectFilterOptions.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select dir="rtl" disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="نوع السؤال" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select dir="rtl" disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="الوسوم" />
              </SelectTrigger>
              <SelectContent>
                {tagsOptions.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div className="flex justify-start pt-2">
             <Button className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]" disabled>
                بحث
            </Button>
           </div>
        </CardContent>
      </Card>

      <section>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">جار تحميل الأسئلة...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center min-h-[300px] bg-destructive/10 p-6 rounded-lg text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-semibold mb-2">{error}</p>
            <Button variant="outline" onClick={fetchAllQuestions} className="border-destructive text-destructive hover:bg-destructive/20">
              <RefreshCw className="ml-2 h-4 w-4" />
              إعادة المحاولة
            </Button>
          </div>
        ) : (
          <QuestionList questions={filteredQuestions} />
        )}
      </section>
    </div>
  );
}
