"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function SideNavBar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'My Links', href: '/dashboard/links', icon: 'link' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: 'analytics' },
    { name: 'Settings', href: '/dashboard/profile', icon: 'settings' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full flex flex-col py-stack-lg bg-surface-container-low/90 backdrop-blur-xl border-r border-white/5 shadow-2xl w-64 z-[60] hidden md:flex">
      <div className="px-gutter mb-stack-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center border border-primary/30">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>link</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-extrabold text-primary">ShortLink Pro</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Developer Plan</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                isActive 
                  ? 'text-primary bg-white/5 border-r-2 border-primary scale-95' 
                  : 'text-on-surface-variant hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? {fontVariationSettings: "'FILL' 1"} : {}}>{item.icon}</span>
              <span className="font-label-md text-label-md">{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="px-4 mt-auto space-y-4">
        <div className="space-y-1">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-white/10 hover:text-white transition-all">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Logout</span>
          </button>
        </div>
        <div className="px-4 pt-4 border-t border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/10 bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <span className="font-label-md text-label-md text-on-surface truncate">{user?.name || 'User Profile'}</span>
        </div>
      </div>
    </nav>
  );
}
