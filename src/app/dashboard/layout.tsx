
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { EdumentorLogo } from "@/components/common/EdumentorLogo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppHeader /> {/* Sticky, full-width header */}
      {/* This div is now a flex item in the column defined by SidebarProvider */}
      <div className="flex flex-1 w-full overflow-hidden"> {/* Added w-full and overflow-hidden */}
        <SidebarNavigation />
        {/* Content column - No horizontal padding here. It's applied to main's inner div. */}
        <div
          className="flex flex-col flex-1 min-h-screen
                     pt-20 {/* Header offset */}
                     transition-[padding] duration-200 ease-linear" 
        >
          <main
            className="flex-1 p-4 sm:p-6 bg-background
                       sm:pr-[var(--sidebar-width-icon)] md:pr-0
                       peer-data-[state=expanded]:peer-data-[side=right]:sm:pr-[var(--sidebar-width)]
                       transition-[padding] duration-200 ease-linear" 
          >
            {children}
          </main>
          {/* Footer has been removed */}
        </div>
      </div>
    </SidebarProvider>
  );
}
