"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function TopNavBar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  // Create breadcrumbs from pathname
  const paths = pathname.split('/').filter(Boolean);
  const title = paths[paths.length - 1] || 'Dashboard';

  return (
    <header className="fixed top-0 w-full md:w-[calc(100%-16rem)] z-50 flex justify-between items-center px-margin-desktop h-16 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-4 md:hidden">
        <h2 className="font-headline-md text-headline-md font-bold text-primary">ShortLink</h2>
      </div>
      <div className="hidden md:block">
        <span className="font-label-sm text-label-sm text-on-surface-variant capitalize">
          Home / <span className="text-on-surface">{title}</span>
        </span>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <Link href="/dashboard/settings" className="p-2 rounded-full text-on-surface-variant hover:text-white transition-colors hover:bg-white/5">
          <span className="material-symbols-outlined">settings</span>
        </Link>
        <div className="h-6 w-px bg-white/10 mx-2"></div>
        <Link href="/dashboard/settings" className="font-label-md text-label-md text-primary font-medium hover:text-white transition-colors flex items-center gap-2">
          Profile
          <div className="w-6 h-6 rounded-full border border-white/10 bg-primary/20 flex items-center justify-center text-primary text-xs md:hidden">
            {user?.name?.[0] || 'U'}
          </div>
        </Link>
      </div>
    </header>
  );
}
