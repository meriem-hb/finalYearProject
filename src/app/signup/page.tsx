
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EdumentorLogo } from '@/components/common/EdumentorLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signUpWithEmail, signInWithGoogle, getFirebaseAuthErrorMessage } from '@/lib/auth';

const SignupFormSchema = z.object({
  username: z.string().min(3, { message: 'اسم المستخدم يجب أن يتكون من 3 أحرف على الأقل.' }).max(20, { message: 'اسم المستخدم يجب ألا يتجاوز 20 حرفًا.' }),
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.' }),
});

type SignupFormValues = z.infer<typeof SignupFormSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setIsLoading(true);
    const { user, error } = await signUpWithEmail(data.email, data.password, data.username);
    setIsLoading(false);

    if (error) {
      toast({
        title: 'خطأ في إنشاء الحساب',
        description: error,
        variant: 'destructive',
      });
    } else if (user) {
      toast({
        title: 'نجاح!',
        description: 'تم إنشاء حسابك بنجاح. قم بتحديد اهتماماتك.',
      });
      router.push('/signup/interests');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { user, error } = await signInWithGoogle();
    setIsGoogleLoading(false);

    if (error) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error,
        variant: 'destructive',
      });
    } else if (user) {
      toast({
        title: 'أهلاً بك!',
        description: 'تم تسجيل الدخول بنجاح.',
      });
       // If user from Google is new, their profile might have been created.
       // New users via Google should also go to interests page.
      router.push('/signup/interests');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4" dir="rtl">
      <div className="relative w-full max-w-md bg-card text-card-foreground rounded-xl shadow-2xl p-8">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </Button>
        </Link>
        
        <div className="flex flex-col items-center mb-6">
          <EdumentorLogo />
          <p className="mt-4 text-center text-lg text-foreground">
            صفحتك الرئيسية جاهزة للانطلاق!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username" className="block text-sm font-medium text-foreground mb-1 text-right">
              اسم المستخدم
            </Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="أدخل اسم المستخدم الخاص بك"
              className="text-right"
              {...register('username')}
            />
            {errors.username && <p className="text-xs text-destructive mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-1 text-right">
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="عنوان البريد الإلكتروني"
              className="text-right"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-1 text-right">
              كلمة المرور
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="كلمة المرور"
                className="text-right pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            بالنقر على "إنشاء حسابي"، فإنك تؤكد موافقتك على{' '}
            <Link href="/terms" className="underline hover:text-primary">الشروط والأحكام</Link> و{' '}
            <Link href="/privacy" className="underline hover:text-primary">سياسة الخصوصية</Link>.
          </p>
          
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3" disabled={isLoading}>
            {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin rtl:mr-2 rtl:ml-0" />}
            إنشاء حسابي
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="mx-4 text-sm text-muted-foreground">أو</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <Button variant="outline" className="w-full text-foreground hover:bg-muted text-md py-3 border-border" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
           {isGoogleLoading ? <Loader2 className="ml-2 h-5 w-5 animate-spin rtl:mr-2 rtl:ml-0" /> : <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 2.03-4.66 2.03-3.86 0-6.99-3.14-6.99-7.02s3.13-7.02 6.99-7.02c1.93 0 3.34.72 4.21 1.64l2.02-2.02C18.69 1.39 16.01 0 12.48 0 5.88 0 .02 5.84.02 12.98s5.86 12.98 12.46 12.98c3.39 0 5.95-1.13 7.9-3.08.95-.95 2.19-3.03 2.19-5.25 0-.82-.07-1.6-.2-2.32H12.48z"/></svg>}
          متابعة بواسطة جوجل
        </Button>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
