import SideNavBar from '@/components/SideNavBar';
import TopNavBar from '@/components/TopNavBar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-on-background font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      <SideNavBar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative">
        <TopNavBar />
        {/* Canvas */}
        <main className="flex-1 p-gutter pt-[calc(64px+24px)] max-w-container-max mx-auto w-full space-y-stack-lg pb-stack-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
