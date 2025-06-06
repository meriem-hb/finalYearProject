
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EdumentorLogo } from '@/components/common/EdumentorLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Search, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, FirebaseAuthUser } from '@/lib/auth';
import { updateUserInterests, getUserProfileDocument } from '@/lib/user';
import type { AppUser } from '@/types';

const allInterests = [
  { id: 'math', name: 'رياضيات' },
  { id: 'physics', name: 'فيزياء' },
  { id: 'chemistry', name: 'كيمياء' },
  { id: 'biology', name: 'علوم طبيعية' },
  { id: 'history', name: 'تاريخ' },
  { id: 'geography', name: 'جغرافيا' },
  { id: 'arabic_literature', name: 'أدب عربي' },
  { id: 'english', name: 'لغة إنجليزية' },
  { id: 'french', name: 'لغة فرنسية' },
  { id: 'cs', name: 'إعلام آلي' },
  { id: 'philosophy', name: 'فلسفة' },
  { id: 'economics', name: 'اقتصاد وتسيير' },
  { id: 'islamic_studies', name: 'علوم إسلامية' },
  { id: 'art', name: 'فنون' },
  { id: 'music', name: 'موسيقى' },
  { id: 'sports', name: 'رياضة' },
];

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser(); // From Firebase Auth
    if (user) {
      setCurrentUser(user);
      // Optionally, fetch existing interests if user revisits this page
      getUserProfileDocument(user.uid).then(profile => {
        if (profile?.interests) {
          setSelectedInterests(profile.interests);
        }
        setIsPageLoading(false);
      });
    } else {
      toast({
        title: 'غير مصرح به',
        description: 'الرجاء تسجيل الدخول أولاً.',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [router, toast]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };
  
  const initialInterests = allInterests.slice(0, 6);

  const filteredInterests = allInterests.filter(interest =>
    interest.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !initialInterests.some(initInt => initInt.id === interest.id) // Exclude already shown initial interests from search result if they match
  );


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) {
      toast({ title: 'خطأ', description: 'المستخدم غير مسجل الدخول.', variant: 'destructive' });
      return;
    }
    if (selectedInterests.length === 0) {
      toast({ title: 'تنبيه', description: 'الرجاء اختيار اهتمام واحد على الأقل.', variant: 'default' });
      return;
    }

    setIsLoading(true);
    const success = await updateUserInterests(currentUser.uid, selectedInterests);
    setIsLoading(false);

    if (success) {
      toast({
        title: 'نجاح!',
        description: 'تم حفظ اهتماماتك بنجاح.',
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'خطأ',
        description: 'لم نتمكن من حفظ اهتماماتك. حاول مرة أخرى.',
        variant: 'destructive',
      });
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4" dir="rtl">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">جار التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4" dir="rtl">
      <div className="relative w-full max-w-lg bg-card text-card-foreground rounded-xl shadow-2xl p-8">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </Button>
        </Link>
        
        <div className="flex flex-col items-center mb-6">
          <EdumentorLogo />
        </div>

        <h1 className="text-xl font-semibold text-center text-foreground mb-2">
          لنبدأ بإعداد صفحتك الرئيسية
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          اختر بعض المواضيع التي تهمك :
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="block text-sm font-medium text-foreground text-right">
              المواضيع المقترحة
            </Label>
            <div className="flex flex-wrap gap-3 justify-center">
              {initialInterests.map((interest) => (
                <Button
                  key={interest.id}
                  type="button"
                  variant={selectedInterests.includes(interest.id) ? 'default' : 'outline'}
                  onClick={() => toggleInterest(interest.id)}
                  className={`
                    ${selectedInterests.includes(interest.id) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-border text-foreground hover:bg-muted'}
                  `}
                >
                  {interest.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="searchInterests" className="block text-sm font-medium text-foreground mb-1 text-right">
              أو ابحث عنها :
            </Label>
            <div className="relative">
              <Input
                id="searchInterests"
                name="searchInterests"
                type="search"
                placeholder="بحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-right ps-10" 
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            {searchTerm && filteredInterests.length > 0 && (
              <div className="mt-2 max-h-32 overflow-y-auto rounded-md border border-border p-2 space-y-1">
                {filteredInterests.map(interest => (
                   <Button
                    key={interest.id}
                    type="button"
                    variant={selectedInterests.includes(interest.id) ? 'default' : 'outline'}
                    onClick={() => {
                        toggleInterest(interest.id);
                        // Optionally clear search: setSearchTerm(''); 
                    }}
                    className={`w-full justify-start text-sm ${selectedInterests.includes(interest.id) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-transparent text-foreground hover:bg-muted'}`}
                  >
                    {interest.name}
                  </Button>
                ))}
              </div>
            )}
             {searchTerm && filteredInterests.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">لا توجد نتائج للبحث.</p>
            )}
          </div>
          
          {selectedInterests.length > 0 && (
            <div>
                <Label className="block text-sm font-medium text-foreground mb-2 text-right">
                    اهتماماتك المختارة ({selectedInterests.length}):
                </Label>
                <div className="flex flex-wrap gap-2">
                    {selectedInterests.map(interestId => {
                        const interest = allInterests.find(i => i.id === interestId);
                        return interest ? (
                          <Badge 
                            key={interest.id} 
                            variant="secondary" 
                            className="text-sm cursor-pointer hover:bg-destructive/80 hover:text-destructive-foreground"
                            onClick={() => toggleInterest(interest.id)}
                            title={`إزالة ${interest.name}`}
                          >
                            {interest.name} <X className="ms-1 h-3 w-3" />
                          </Badge>
                        ) : null;
                    })}
                </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3" disabled={isLoading}>
            {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin rtl:mr-2 rtl:ml-0" />}
            التالي
          </Button>
        </form>
        
        <p className="mt-8 text-center text-xs text-muted-foreground">
          هذه الاهتمامات ستساعدنا في تخصيص تجربتك.
        </p>
      </div>
    </div>
  );
}
