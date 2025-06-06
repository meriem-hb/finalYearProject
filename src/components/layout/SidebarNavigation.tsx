
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  HelpCircle,
  LibraryBig,
  Users,
  PlusCircle, // Assuming this was for an "Ask Question" button, removed as per previous request for dashboard page
} from 'lucide-react';
import { Button } from '@/components/ui/button'; // For "Ask Question" if it were here


const navItems = [
  { href: '/dashboard', label: 'الصفحة الرئيسية', icon: Home },
  { href: '/dashboard/questions', label: 'الأسئلة', icon: HelpCircle },
  { href: '/dashboard/content', label: 'المواد', icon: LibraryBig },
  { href: '/dashboard/users', label: 'المستخدمين', icon: Users },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" side="right" variant="sidebar" className="bg-card border-l shadow-sm">
      <Separator />
      {/* Increased top padding to push content below sticky header */}
      <SidebarContent className="pt-28"> 
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true)}
                tooltip={item.label}
                className="justify-end data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-muted/50 text-foreground"
              >
                <Link href={item.href} className="flex items-center w-full">
                  <span className="flex-1 text-right">{item.label}</span>
                  <item.icon className="rtl:mr-3 ltr:ml-3 h-5 w-5" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
    </Sidebar>
  );
}
