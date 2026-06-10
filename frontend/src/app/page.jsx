import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* TopNavBar */}
      <nav className="bg-background/80 backdrop-blur-md fixed top-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 border-b border-white/10 no-shadows">
        <div className="font-headline-md text-headline-md font-bold text-primary">
          ShortLink
        </div>
        <div className="flex items-center gap-stack-md">
          <Link href="/auth" className="px-4 py-2 rounded-lg bg-surface-container-high border border-white/10 hover:bg-surface-bright transition-colors font-label-md text-label-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">person</span>
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-stack-lg">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop flex flex-col items-center text-center mt-12 mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-container/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>

          <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl mb-stack-md leading-tight">
            Shorten Links. <span className="text-gradient">Track Performance.</span> Scale Smarter.
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-stack-lg">
            Create branded short links and monitor engagement through real-time analytics designed for high-performance developer teams.
          </p>

          {/* URL Input */}
          <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4 mb-stack-lg p-2 bg-[#161618] border border-white/10 rounded-xl shadow-2xl relative z-10 group hover:border-white/25 transition-all">
            <div className="flex-grow flex items-center px-4">
              <span className="material-symbols-outlined text-outline-variant mr-3">link</span>
              <input
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-on-surface font-body-md placeholder:text-outline-variant"
                placeholder="Paste your long URL here..."
                type="text"
              />
            </div>
            <Link href="/auth" className="px-6 py-3 rounded-lg bg-gradient-to-r from-inverse-primary to-primary text-white font-label-md text-label-md hover:shadow-[0_0_15px_rgba(208,188,255,0.4)] transition-all flex-shrink-0 flex items-center justify-center">
              Create Link
            </Link>
          </div>

          <div className="flex gap-stack-md">
            <Link href="/auth" className="px-6 py-3 rounded-lg border border-white/15 text-on-surface font-label-md text-label-md hover:bg-white/5 transition-colors">
              View Demo
            </Link>
          </div>
        </section>

        {/* Analytics Preview */}
        <section className="max-w-container-max mx-auto px-margin-desktop mb-24">
          <div className="bg-[#161618] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Click Trends</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time engagement across all campaigns</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-tertiary-container/10 border border-tertiary-container/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <span className="font-label-sm text-label-sm text-tertiary uppercase">Live</span>
              </div>
            </div>

            {/* Mock Chart Area */}
            <div className="h-64 w-full relative flex items-end gap-2 pt-4">
              <div className="w-full h-[40%] bg-white/5 rounded-t-sm hover:bg-white/10 transition-colors"></div>
              <div className="w-full h-[60%] bg-white/5 rounded-t-sm hover:bg-white/10 transition-colors"></div>
              <div className="w-full h-[30%] bg-white/5 rounded-t-sm hover:bg-white/10 transition-colors"></div>
              <div className="w-full h-[80%] bg-primary-container/30 border-t-2 border-primary rounded-t-sm hover:bg-primary-container/40 transition-colors relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-xs">842</div>
              </div>
              <div className="w-full h-[50%] bg-white/5 rounded-t-sm hover:bg-white/10 transition-colors"></div>
              <div className="w-full h-[70%] bg-white/5 rounded-t-sm hover:bg-white/10 transition-colors"></div>
              <div className="w-full h-[90%] bg-white/5 rounded-t-sm hover:bg-white/10 transition-colors"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full py-stack-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center border-t border-white/5 mt-auto">
        <div className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4 md:mb-0">
          ShortLink
        </div>
        <div className="text-on-surface-variant font-body-sm text-body-sm mb-4 md:mb-0">
          © 2026 ShortLink Analytics. Built for developers.
        </div>
        <div className="flex gap-stack-md">
          <a className="text-on-surface-variant hover:text-tertiary transition-colors font-body-sm text-body-sm" href="#">Sitemap</a>
          <a className="text-on-surface-variant hover:text-tertiary transition-colors font-body-sm text-body-sm" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant hover:text-tertiary transition-colors font-body-sm text-body-sm" href="#">Terms of Service</a>
          <a className="text-on-surface-variant hover:text-tertiary transition-colors font-body-sm text-body-sm" href="#">API Docs</a>
          <a className="text-on-surface-variant hover:text-tertiary transition-colors font-body-sm text-body-sm" href="#">Status</a>
        </div>
      </footer>
    </div>
  );
}
