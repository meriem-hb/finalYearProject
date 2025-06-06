
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EdumentorLogo } from '@/components/common/EdumentorLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LogOut, LayoutDashboard, Loader2 } from 'lucide-react';
import { onAuthUserProfileChanged, signOutUser } from '@/lib/auth';
import type { AppUser } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function LandingPageHeader() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthUserProfileChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    toast({
      title: 'تم تسجيل الخروج',
      description: 'نأمل رؤيتك قريبًا!',
    });
    router.push('/'); // Or to login page: router.push('/login');
  };

  return (
    <header className="bg-card text-card-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Right side (in RTL) */}
        <div className="flex items-center gap-x-6">
          <EdumentorLogo />
          <div className="relative hidden md:block">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="ابحث..." 
              className="ps-10 pe-4 py-2 h-10 w-64 lg:w-80 rounded-lg border-border focus:ring-primary focus:border-primary bg-background" 
            />
          </div>
        </div>

        {/* Left side (in RTL) */}
        <div className="flex items-center gap-x-3">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : currentUser ? (
            <>
              <Button variant="ghost" asChild className="text-foreground hover:bg-muted">
                <Link href="/dashboard">
                  <LayoutDashboard className="me-2 h-5 w-5" />
                  لوحة التحكم
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <LogOut className="me-2 h-5 w-5" />
                خروج
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-foreground hover:bg-muted hidden sm:inline-flex">
                العربية
              </Button>
              <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/login">الدخول</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/signup">تسجيل</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
