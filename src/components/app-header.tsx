'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AppHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case '/':
        return 'Executive Dashboard';
      case '/residents':
        return 'Residents & Households';
      case '/finance':
        return 'Budget & Finance (AIP)';
      case '/documents':
        return 'Documents & Clearances';
      case '/meetings':
        return 'Meetings & Ordinances';
      case '/sectors':
      case '/committees':
        return 'Council Standing Committees';
      case '/geographic-sectors':
        return 'Geographic Sectors & Zones';
      case '/blotters':
        return 'Peace & Blotter Cases';
      case '/reports':
        return 'Reports & Analytics';
      case '/audit':
        return 'System Audit Trail';
      case '/accounts':
        return 'User Accounts & Roles';
      default:
        return 'Portal';
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 py-2.5 lg:gap-2 lg:px-6">
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <SidebarTrigger className="-ml-1" />

          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-bold">{getTabTitle(pathname)}</span>

            <span className="text-muted-foreground text-[10px] font-medium">
              Barangay Calungboyan, Santa, Ilocos Sur
            </span>
          </div>
        </div>

        <div>
          <Button variant="outline" size="icon-lg" onClick={toggleTheme}>
            {theme === 'light' ? <Moon /> : <Sun />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
