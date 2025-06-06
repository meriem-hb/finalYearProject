
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser, FirebaseAuthUser } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function ProfileRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const queryString = searchParams.toString();
      router.replace(`/dashboard/profile/${user.uid}${queryString ? `?${queryString}` : ''}`);
    } else {
      toast({
        title: "غير مصرح به",
        description: "الرجاء تسجيل الدخول لعرض الملف الشخصي.",
        variant: "destructive",
      });
      router.replace('/login');
    }
    const timer = setTimeout(() => setIsLoading(false), 500); 
    return () => clearTimeout(timer);

  }, [router, toast, searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
     <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">يتم توجيهك...</p>
      </div>
  );
}

export default function ProfileRedirectPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <ProfileRedirectContent />
    </Suspense>
  );
}
