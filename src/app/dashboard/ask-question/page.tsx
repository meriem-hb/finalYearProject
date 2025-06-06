"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, FirebaseAuthUser } from "@/lib/auth";
import { addQuestion } from "@/lib/data";

const AskQuestionFormSchema = z.object({
  title: z
    .string()
    .min(10, { message: "العنوان يجب أن لا يقل عن 10 أحرف." })
    .max(150, { message: "العنوان يجب أن لا يتجاوز 150 حرفًا." }),
  content: z.string().min(20, { message: "العرض يجب أن لا يقل عن 20 حرفًا." }),
  gradeLevel: z.string().optional(),
  subject: z.string().optional(),
  tags: z.string().optional(),
});

type AskQuestionFormValues = z.infer<typeof AskQuestionFormSchema>;

// Placeholder options for dropdowns
const gradeLevelOptions = [
  "الثانية ثانوي",
  "الأولى ثانوي",
  "الثالثة ثانوي",
  "بكالوريا",
  "تعليم أساسي",
];
const subjectOptions = [
  "رياضيات",
  "فيزياء",
  "علوم طبيعية",
  "أدب عربي",
  "تاريخ وجغرافيا",
  "فلسفة",
  "لغة انجليزية",
  "لغة فرنسية",
  "إعلام آلي",
  "تسيير واقتصاد",
];

export default function AskQuestionPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AskQuestionFormValues>({
    resolver: zodResolver(AskQuestionFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      gradeLevel: undefined,
      subject: undefined,
    },
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      toast({
        title: "غير مصرح به",
        description: "الرجاء تسجيل الدخول لطرح سؤال.",
        variant: "destructive",
      });
      router.push("/login");
    } else {
      setCurrentUser(user);
    }
  }, [router, toast]);

  const onSubmit: SubmitHandler<AskQuestionFormValues> = async (data) => {
    if (!currentUser) {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على المستخدم الحالي.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const questionTags = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    const questionData = {
      title: data.title,
      content: data.content,
      tags: questionTags,
      gradeLevel: data.gradeLevel,
      subject: data.subject,
    };

    const questionId = await addQuestion(
      questionData,
      currentUser.uid,
      currentUser.displayName || currentUser.email || "مستخدم مجهول",
    );

    setIsSubmitting(false);

    if (questionId) {
      toast({
        title: "نجاح!",
        description: "تم نشر سؤالك بنجاح.",
      });
      reset(); // Reset form fields to defaultValues
      router.push("/dashboard");
    } else {
      toast({
        title: "خطأ في النشر",
        description: "لم نتمكن من نشر سؤالك. حاول مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4" dir="rtl">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">
            شارك سؤالك مع الجميع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-3/4 space-y-6">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-lg font-semibold text-foreground mb-1 block text-right"
                  >
                    العنوان
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2 text-right">
                    اكتب سؤالك بوضوح كما لو أنك تطرحه على شخص أمامك
                  </p>
                  <Input
                    id="title"
                    className="text-right"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive mt-1 text-right">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="gradeLevel"
                      className="text-sm font-semibold text-foreground mb-1 block text-right"
                    >
                      المرحلة الدراسية
                    </Label>
                    <Controller
                      name="gradeLevel"
                      control={control}
                      render={({ field }) => (
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id="gradeLevel">
                            <SelectValue placeholder="اختر المرحلة" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradeLevelOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gradeLevel && (
                      <p className="text-xs text-destructive mt-1 text-right">
                        {errors.gradeLevel.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="subject"
                      className="text-sm font-semibold text-foreground mb-1 block text-right"
                    >
                      مادة / موضوع
                    </Label>
                    <Controller
                      name="subject"
                      control={control}
                      render={({ field }) => (
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="اختر المادة" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjectOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive mt-1 text-right">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="content"
                    className="text-lg font-semibold text-foreground mb-1 block text-right"
                  >
                    العرض
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2 text-right">
                    أضف كل التفاصيل الضرورية لفهم سؤالك جيدًا
                  </p>
                  <Textarea
                    id="content"
                    rows={8}
                    className="text-right"
                    {...register("content")}
                  />
                  {errors.content && (
                    <p className="text-xs text-destructive mt-1 text-right">
                      {errors.content.message}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-muted-foreground hover:text-foreground"
                  >
                    <ImageIcon className="ml-2 h-4 w-4" />
                    عرض صورة
                  </Button>
                </div>

                <div>
                  <Label
                    htmlFor="tags"
                    className="text-lg font-semibold text-foreground mb-1 block text-right"
                  >
                    الوسوم (مفصولة بفاصلة)
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2 text-right">
                    حدد مجالات السؤال باستخدام الوسوم المناسبة (مثال: جبر,
                    معادلات, فيزياء نووية)
                  </p>
                  <Input
                    id="tags"
                    placeholder="جبر, معادلات, فيزياء نووية"
                    className="text-right"
                    {...register("tags")}
                  />
                  {errors.tags && (
                    <p className="text-xs text-destructive mt-1 text-right">
                      {errors.tags.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/4 flex flex-col items-center mt-8 md:mt-0">
                <NextImage
                  src="/images/photo_3.png"
                  alt="Question illustration"
                  width={250}
                  height={250}
                  className="rounded-lg"
                  data-ai-hint="question mark people"
                />
              </div>
            </div>
            <CardFooter className="flex justify-start px-0 pt-6">
              <Button
                type="submit"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="rtl:ml-2 ltr:mr-2 h-5 w-5 animate-spin" />
                )}
                {isSubmitting ? "جار النشر..." : "نشر"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
