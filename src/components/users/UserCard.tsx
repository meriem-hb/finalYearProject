
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AppUser } from '@/types';
import { UserCircle } from 'lucide-react';

interface UserCardProps {
  user: AppUser;
}

export function UserCard({ user }: UserCardProps) {
  const userInitial = user.displayName?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <Link href={`/dashboard/profile/${user.uid}`} passHref legacyBehavior>
      <a className="block group">
        <Card className="h-full flex flex-col items-center justify-center text-center p-4 shadow-md hover:shadow-lg transition-shadow duration-200 hover:border-primary">
          <CardHeader className="p-2 mb-2">
            <Avatar className="h-20 w-20 border-2 border-muted group-hover:border-primary transition-colors">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.username || "User avatar"} />
              <AvatarFallback className="text-2xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {user.photoURL ? userInitial : <UserCircle className="h-10 w-10" />}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="p-2 flex-grow flex flex-col justify-center">
            <CardTitle className="text-md font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {user.displayName || user.username || 'مستخدم غير معروف'}
            </CardTitle>
            {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
