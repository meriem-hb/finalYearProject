
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Settings, LogOut, Activity, Bookmark, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signOutUser, onAuthUserProfileChanged } from '@/lib/auth';
import type { AppUser } from '@/types';
import { useEffect, useState } from "react";

export function UserDropdown() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthUserProfileChanged(setCurrentUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    toast({
      title: 'تم تسجيل الخروج',
      description: 'نأمل رؤيتك قريبًا!',
    });
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            {currentUser?.photoURL ? (
              <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || currentUser.username || "User Avatar"} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {!currentUser?.photoURL && <UserCircle className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 text-right">
            <p className="text-sm font-medium leading-none">
              {currentUser?.displayName || currentUser?.username || "مستخدم"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex justify-end">
            <span>الملف الشخصي</span>
            <UserCircle className="ms-2 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile?tab=activities" className="flex justify-end">
            <span>الأنشطة</span>
            <Activity className="ms-2 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile?tab=history" className="flex justify-end">
            <span>المحفوظات</span>
            <Bookmark className="ms-2 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile?tab=attributes" className="flex justify-end">
            <span>السمات</span>
            <Award className="ms-2 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile?tab=settings" className="flex justify-end">
            <span>الإعدادات</span>
            <Settings className="ms-2 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive flex justify-end">
          <span>تسجيل الخروج</span>
          <LogOut className="ms-2 h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
