import React from 'react';
import { cn } from '@/utils';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useSidebar } from '@/hooks/useSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  const { isOpen, isCollapsed, close, toggle, toggleCollapse } = useSidebar();
  const [cmdOpen, setCmdOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        isCollapsed={isCollapsed}
        onClose={close}
        onToggleCollapse={toggleCollapse}
      />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Main area — pushes right of sidebar on desktop */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0',
          'transition-all duration-250 ease-in-out',
          // Desktop: offset by sidebar width
          isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        )}
      >
        {/* Sticky header */}
        <Header onMenuClick={toggle} />

        {/* Page content */}
        <main
          id="main-content"
          role="main"
          className="flex-1 pt-16 min-h-0"
        >
          <div className="p-4 lg:p-6 xl:p-8 max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 lg:px-6 py-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} TransitOps · Smart Transport Operations Platform
          </p>
        </footer>
      </div>
    </div>
  );
}
