"use client";

import { useState, useEffect } from "react";
import { getQuestions } from "@/lib/data";
import { QuestionList } from "@/components/questions/QuestionList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calculator,
  Atom,
  Leaf,
  Globe2,
  Brain,
  Languages,
  Code,
  BarChart2,
  Loader2,
} from "lucide-react";
import { onAuthUserProfileChanged } from "@/lib/auth";
import type { AppUser } from "@/types";
import Image from "next/image";
import { LandingPageHeader } from "@/components/layout/LandingPageHeader";

// Define a basic structure for community questions
// This might need to be aligned with the actual data from getQuestions() in @/lib/data
interface CommunityQuestion {
  id: string;
  title: string;
  contentPreview: string; // A short preview of the question content
  author: string;
  category: string;
  answersCount: number;
  createdAt: string; // Formatted date string, e.g., "منذ ساعتين"
}

export default function LandingPage() {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthUserProfileChanged((user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });

    async function fetchQuestions() {
      try {
        const fetchedQuestions = await getQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Failed to fetch questions", error);
        // Optionally set an error state here
      } finally {
        setIsLoadingQuestions(false);
      }
    }

    fetchQuestions();

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const categories = [
    {
      name: "رياضيات",
      icon: <Calculator className="h-10 w-10 mb-2 text-primary" />,
    },
    { name: "فيزياء", icon: <Atom className="h-10 w-10 mb-2 text-primary" /> },
    {
      name: "علوم طبيعية",
      icon: <Leaf className="h-10 w-10 mb-2 text-primary" />,
    },
    {
      name: "تاريخ و جغرافيا",
      icon: <Globe2 className="h-10 w-10 mb-2 text-primary" />,
    },
    { name: "فلسفة", icon: <Brain className="h-10 w-10 mb-2 text-primary" /> },
    {
      name: "لغات",
      icon: <Languages className="h-10 w-10 mb-2 text-primary" />,
    },
    {
      name: "إعلام آلي",
      icon: <Code className="h-10 w-10 mb-2 text-primary" />,
    },
    {
      name: "تسيير",
      icon: <BarChart2 className="h-10 w-10 mb-2 text-primary" />,
    },
  ];

  return (
    <>
      <LandingPageHeader />
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground rounded-lg shadow-xl mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-right">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pe-10">
            <h1 className="text-4xl sm:text-5xl font-headline font-extrabold mb-6">
              شارك معرفتك
            </h1>
            <p className="text-lg md:text-xl mb-10">
              اطرح الأسئلة - أجب على غيرك
              <br />
              منصة حرة تجمع الطلاب والمعلمين
            </p>
            {isLoadingAuth ? (
              <Loader2 className="h-8 w-8 animate-spin text-background" />
            ) : currentUser ? (
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-3 bg-background text-primary hover:bg-background/90 border border-transparent"
              >
                <Link href="/dashboard">انظم الى مجتمعاتنا التعليمية</Link>
              </Button>
            ) : (
              <p className="text-lg md:text-xl">
                قم بتسجيل الدخول أو إنشاء حساب للبدء.
              </p>
            )}
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-start">
            <Image
              src="/images/photo_1.png"
              alt="Education concept illustration"
              width={300}
              height={220}
              className="rounded-lg"
              data-ai-hint="education learning"
            />
          </div>
        </div>
      </section>

      {/* What is Edumenter Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-2/5 mb-10 md:mb-0 flex justify-center">
            <Image
              src="/images/photo_2.png"
              alt="Two people with a large question mark"
              width={350}
              height={400}
              className="rounded-lg"
              data-ai-hint="people question"
            />
          </div>
          <div className="md:w-3/5 md:ps-12 text-center md:text-right">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
              ما هو Edumentor ؟
            </h2>
            <p className="text-lg text-foreground leading-relaxed">
              هل أنت تلميذ في الطور الثانوي ولديك أسئلة دون إجابة؟ أو تملك معرفة
              ترغب في مشاركتها؟ هذه منصتك! مجتمع تعليمي مجاني، يتيح لك طرح
              الأسئلة، الإجابة، واكتشاف موارد مفيدة، في بيئة مفتوحة تحفز التعلم
              والتعاون بين تلاميذ الثانوي من مختلف أنحاء الجزائر.
            </p>
          </div>
        </div>
      </section>

      {/* Questions List Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-10 text-center">
          عالم من الأسئلة، يلتقي بعالم من الإجابات
        </h2>
        {isLoadingQuestions ? (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">جاري تحميل الأسئلة...</p>
          </div>
        ) : (
          <QuestionList questions={questions} />
        )}
      </div>

      {/* Categories Section */}
      <section className="py-16 md:py-20 bg-secondary/30 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-primary mb-12 text-center">
            تصفح حسب المادة
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6 text-center">
            {categories.map((category) => (
              <Link
                href="#"
                key={category.name}
                className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md hover:shadow-xl transition-shadow hover:bg-card/90"
              >
                {category.icon}
                <span className="text-sm font-medium text-foreground">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
