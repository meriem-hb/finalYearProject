
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { EdumentorLogo } from "@/components/common/EdumentorLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Globe } from "lucide-react";
import { UserDropdown } from "./UserDropdown";

export function AppHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchTerm.trim())}`);
      // setSearchTerm(''); // Optionally clear search term after navigation
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center border-b border-border bg-card text-card-foreground">
      <div className="container mx-auto flex h-full items-center justify-between">
        {/* Right side (for RTL): Logo and Mobile Sidebar Trigger */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden text-muted-foreground hover:bg-accent hover:text-accent-foreground" />
          <EdumentorLogo />
        </div>
        
        {/* Center: Search bar */}
        <div className="flex-1 flex justify-center px-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl"> 
            <Search className="absolute rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="ابحث..." 
              className="rtl:pr-10 ltr:pl-10 w-full h-10 rounded-lg border-input bg-background text-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* Left side (for RTL): Action Icons & User Dropdown */}
        <div className="flex items-center gap-x-1 sm:gap-x-3">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Language</span>
          </Button>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
