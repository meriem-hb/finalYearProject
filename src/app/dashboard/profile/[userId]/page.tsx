
'use client';

import { useEffect, useState, Suspense } from 'react';
import { getCurrentUser, FirebaseAuthUser } from '@/lib/auth';
import { getUserProfileDocument } from '@/lib/user';
import type { AppUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, UserCircle, Edit3, HelpCircle, MessageSquareText, CalendarDays, Activity, Bookmark, Award, SettingsIcon, ChevronLeft, Palette, Sun, Moon, Monitor } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ar } from 'date-fns/locale';

const colorOptions = [
  { id: 'blue', value: 'bg-blue-500', name: 'أزرق' },
  { id: 'teal', value: 'bg-teal-500', name: 'تركواز' },
  { id: 'purple', value: 'bg-purple-500', name: 'بنفسجي' },
  { id: 'orange', value: 'bg-orange-500', name: 'برتقالي' },
  { id: 'pink', value: 'bg-pink-500', name: 'وردي' },
];

function ProfilePageContent() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const userId = params.userId; 

  const [viewedUser, setViewedUser] = useState<AppUser | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [fontSize, setFontSize] = useState([50]);
  const [theme, setTheme] = useState("automatic");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].id);

  const isOwnProfile = currentUser?.uid === viewedUser?.uid;

  useEffect(() => {
    const authUser = getCurrentUser();
    setCurrentUser(authUser);

    if (!userId) {
      toast({ title: "خطأ", description: "معرف المستخدم غير موجود.", variant: "destructive" });
      router.push('/dashboard'); 
      return;
    }

    async function fetchUserProfile() {
      setIsLoading(true);
      const profile = await getUserProfileDocument(userId);
      if (profile) {
        setViewedUser(profile);
      } else {
        toast({
          title: "لم يتم العثور على الملف الشخصي",
          description: "تعذر العثور على الملف الشخصي لهذا المستخدم.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }

    fetchUserProfile();
  }, [userId, router, toast]);
  
  const requestedTab = searchParams.get('tab');
  const validTabs = ["profile", "activities", "history", "attributes"];
  if (isOwnProfile) { // "settings" tab is only valid for own profile
    validTabs.push("settings");
  }
  const defaultTabValue = requestedTab && validTabs.includes(requestedTab) ? requestedTab : "profile";


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!viewedUser) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center" dir="rtl">
        <UserCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-xl font-semibold text-destructive">لم يتم العثور على المستخدم</p>
        <p className="text-muted-foreground">تعذر تحميل الملف الشخصي لهذا المستخدم.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/users">العودة إلى قائمة المستخدمين</Link>
        </Button>
      </div>
    );
  }

  const userInitial = viewedUser.displayName?.charAt(0)?.toUpperCase() || viewedUser.username?.charAt(0)?.toUpperCase() || viewedUser.email?.charAt(0)?.toUpperCase() || '?';
  const joinDate = viewedUser.createdAt ? new Date(viewedUser.createdAt) : new Date();
  const formattedJoinDate = format(joinDate, 'd MMMM yyyy', { locale: ar });
  const memberSince = formatDistanceToNowStrict(joinDate, { addSuffix: true, locale: ar });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div className="flex items-start gap-6 flex-1">
          <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-card shadow-lg">
            <AvatarImage src={viewedUser.photoURL || undefined} alt={viewedUser.displayName || viewedUser.username || "User Avatar"} />
            <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 mt-2">
            <h1 className="text-3xl font-headline font-bold text-primary">
              {viewedUser.displayName || viewedUser.username || 'مستخدم غير معروف'}
            </h1>
            <p className="text-sm text-muted-foreground">عضو {memberSince}</p>
            <p className="text-sm text-muted-foreground">تاريخ الانضمام: {formattedJoinDate}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 md:items-start">
            {isOwnProfile && (
             <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground mt-2 md:mt-0">
                <Edit3 className="ml-2 h-4 w-4" /> تعديل
            </Button>
            )}
            <Card className="p-4 shadow-sm w-full md:w-auto mt-4 md:mt-0">
                <CardTitle className="text-md font-semibold text-center mb-2">إحصاءات المستخدم</CardTitle>
                <div className="flex justify-around gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-primary">0</p>
                        <p className="text-xs text-muted-foreground">سؤال</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-primary">0</p>
                        <p className="text-xs text-muted-foreground">جواب</p>
                    </div>
                </div>
            </Card>
        </div>
      </div>

      <Tabs defaultValue={defaultTabValue} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="profile" className="text-sm md:text-base">
            <UserCircle className="ml-2 h-4 w-4" />الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="activities" className="text-sm md:text-base">
            <Activity className="ml-2 h-4 w-4" />الأنشطة
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm md:text-base">
            <Bookmark className="ml-2 h-4 w-4" />محفوظات
          </TabsTrigger>
          <TabsTrigger value="attributes" className="text-sm md:text-base">
            <Award className="ml-2 h-4 w-4" />السمات
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger value="settings" className="text-sm md:text-base">
              <SettingsIcon className="ml-2 h-4 w-4" />الاعدادات
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-xl font-headline text-primary">نبذة عني</CardTitle>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Edit3 className="ml-1 h-3 w-3" /> تعديل
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  {isOwnProfile ? 'قسم "نبذة عني" الخاص بك فارغ حاليا. هل ترغب في إضافته؟' : 'لم يقم هذا المستخدم بإضافة نبذة عنه بعد.'}
                </p>
                {isOwnProfile && (
                  <Link href="#" className="text-sm text-primary hover:underline font-medium">
                      تعديل الملف الشخصي
                  </Link>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-headline text-primary">منشورات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isOwnProfile ? 'هل أنت جديد هنا؟ جرب الإجابة على سؤال! ستظهر هنا أكثر أسئلتك، إجاباتك، ووسومك فائدة. ابدأ بالإجابة على سؤال أو اختيار وسوم تتناسب مع المواضيع التي تهمك.' : 'سيتم عرض منشورات هذا المستخدم هنا قريبًا.'}
                </p>
              </CardContent>
            </Card>
             {viewedUser.interests && viewedUser.interests.length > 0 && !isOwnProfile && ( 
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline text-primary">الاهتمامات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {viewedUser.interests.map((interest) => (
                            <span key={interest} className="bg-primary/10 text-primary border border-primary/20 text-sm px-3 py-1 rounded-full">
                                {interest}
                            </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="activities">
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-xl font-headline text-primary">الأسئلة</CardTitle>
                <Button variant="link" size="sm" className="text-primary hover:underline">
                  عرض الكل <ChevronLeft className="mr-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">لم يطرح هذا المستخدم أي أسئلة بعد.</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-xl font-headline text-primary">الاجابات</CardTitle>
                 <Button variant="link" size="sm" className="text-primary hover:underline">
                  عرض الكل <ChevronLeft className="mr-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">لم يقدم هذا المستخدم أي إجابات بعد.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary">جميع العناصر المحفوظة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">سيتم عرض العناصر المحفوظة لهذا المستخدم هنا قريبًا.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attributes">
          {isOwnProfile ? (
             <Card className="shadow-md">
              <CardHeader>
                  <CardTitle className="text-xl font-headline text-primary">تخصيص المظهر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-10 p-6">
                <div className="space-y-3">
                  <Label htmlFor="fontSize" className="text-lg font-semibold text-foreground">حجم الخط</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Aa</span>
                    <Slider
                      id="fontSize"
                      defaultValue={fontSize}
                      max={100}
                      step={1}
                      onValueChange={setFontSize}
                      className="w-full"
                      aria-label="حجم الخط"
                    />
                    <span className="text-xl text-muted-foreground">Aa</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-foreground">ألوان</Label>
                  <div className="flex justify-around items-center space-x-2 rtl:space-x-reverse py-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color.id}
                        variant="outline"
                        size="icon"
                        className={`h-10 w-10 rounded-full border-2 p-0 ${selectedColor === color.id ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent'}`}
                        onClick={() => setSelectedColor(color.id)}
                        aria-label={color.name}
                      >
                        <span className={`block h-full w-full rounded-full ${color.value}`} />
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />

                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-foreground">مظهر الواجهة</Label>
                  <RadioGroup
                    defaultValue={theme}
                    onValueChange={setTheme}
                    className="grid grid-cols-3 gap-4"
                  >
                    <Label htmlFor="theme-light" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                      <Sun className="mb-2 h-6 w-6" />
                      فاتح
                    </Label>
                    <Label htmlFor="theme-automatic" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value="automatic" id="theme-automatic" className="sr-only" />
                      <Monitor className="mb-2 h-6 w-6" />
                      تلقائي
                    </Label>
                    <Label htmlFor="theme-dark" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                      <Moon className="mb-2 h-6 w-6" />
                      داكن
                    </Label>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-md">
              <CardHeader><CardTitle className="text-xl font-headline text-primary">السمات</CardTitle></CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">سيتم عرض السمات والإنجازات لهذا المستخدم هنا قريبًا.</p>
                  {viewedUser.interests && viewedUser.interests.length > 0 && (
                      <div className="mt-4">
                          <h3 className="text-lg font-semibold text-foreground mb-2">اهتمامات المستخدم:</h3>
                          <div className="flex flex-wrap gap-2">
                              {viewedUser.interests.map((interest) => (
                              <span key={interest} className="bg-accent/20 text-accent-foreground border border-accent/30 text-sm px-3 py-1 rounded-full">
                                  {interest}
                              </span>
                              ))}
                          </div>
                      </div>
                  )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="settings">
            <Card className="shadow-md">
              <CardHeader>
                  <CardTitle className="text-xl font-headline text-primary">إعدادت الحساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-10 p-6">
                <p className="text-muted-foreground">لا توجد إعدادات عامة للحساب في الوقت الحالي.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
