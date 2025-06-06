
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2, AlertTriangle, UsersIcon } from 'lucide-react';
import { UserCard } from '@/components/users/UserCard';
import { getAllUserProfiles } from '@/lib/user';
import type { AppUser } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUsers = await getAllUserProfiles();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("فشل في تحميل قائمة المستخدمين. الرجاء المحاولة مرة أخرى.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const nameMatch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || emailMatch;
  });

  return (
    <div className="space-y-8 p-4 md:p-6" dir="rtl">
      <section className="text-center">
        <h1 className="text-3xl font-headline font-bold text-primary mb-4">
          المستخدمين
        </h1>
        <div className="relative mx-auto w-full max-w-lg">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني..."
            className="pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">جار تحميل المستخدمين...</p>
        </div>
      ) : error ? (
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-semibold">{error}</p>
          </CardContent>
        </Card>
      ) : filteredUsers.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.uid} user={user} />
          ))}
        </section>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-10 text-center">
            <UsersIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              {searchTerm ? "لا يوجد مستخدمين يطابقون بحثك." : "لا يوجد مستخدمين لعرضهم حاليًا."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
