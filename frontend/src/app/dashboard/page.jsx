"use client";
import React, { useEffect, useState } from 'react';
import { apiClient, getShortLinkBaseUrl } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    // In a real implementation, we would fetch aggregation of all URLs
    // For now, let's simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        const res = await apiClient.get('/urls');
        const urls = res.data.data || [];
        const totalLinks = urls.length;
        const totalClicks = urls.reduce((acc, curr) => acc + (curr.click_count || 0), 0);
        const sortedUrls = [...urls].sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
        const topLink = sortedUrls[0] ? `${getShortLinkBaseUrl().replace(/^https?:\/\//, '')}/${sortedUrls[0].short_code}` : 'N/A';
        const topLinkClicks = sortedUrls[0] ? sortedUrls[0].click_count || 0 : 0;
        
        setAnalytics({
          totalLinks,
          totalClicks,
          topLink,
          topLinkClicks,
          urls: sortedUrls.slice(0, 5)
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Performance Overview</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Track your link engagement and audience metrics across all channels.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container border border-white/5 p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded text-label-sm font-label-sm text-on-surface bg-surface-bright shadow-sm">7 Days</button>
          <button className="px-4 py-1.5 rounded text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface">30 Days</button>
          <button className="px-4 py-1.5 rounded text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface">All Time</button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Stat Card 1 */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Clicks</span>
            <div className="p-1.5 rounded-md bg-tertiary/10 text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="font-label-sm text-label-sm">+14.2%</span>
            </div>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">{loading ? '...' : analytics?.totalClicks?.toLocaleString()}</div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Total link engagement</p>
        </div>

        {/* Stat Card 2 */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Top Performing Link</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">emoji_events</span>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface truncate">{loading ? '...' : analytics?.topLink}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-label-md text-label-md text-primary">{loading ? '...' : analytics?.topLinkClicks?.toLocaleString()} Clicks</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Top performing</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/10 rounded-full blur-2xl group-hover:bg-tertiary/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Links Created</span>
            <div className="p-1.5 rounded-md bg-tertiary/10 text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">link</span>
            </div>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">{loading ? '...' : analytics?.totalLinks?.toLocaleString()}</div>
          {/* Mini Sparkline */}
          <div className="w-full h-8 mt-2 opacity-50 flex items-end gap-1">
            <div className="w-full bg-tertiary rounded-t-sm" style={{height: '20%'}}></div>
            <div className="w-full bg-tertiary rounded-t-sm" style={{height: '35%'}}></div>
            <div className="w-full bg-tertiary rounded-t-sm" style={{height: '25%'}}></div>
            <div className="w-full bg-tertiary rounded-t-sm" style={{height: '50%'}}></div>
            <div className="w-full bg-tertiary rounded-t-sm" style={{height: '40%'}}></div>
            <div className="w-full bg-tertiary rounded-t-sm" style={{height: '70%'}}></div>
            <div className="w-full bg-tertiary rounded-t-sm" style={{height: '100%'}}></div>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="grid grid-cols-1 gap-gutter mt-6">
        {/* Top Links */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">Top Performing URLs</h3>
            <a className="text-primary font-label-sm text-label-sm hover:underline" href="/dashboard/links">View All</a>
          </div>
          <div className="space-y-5">
            {loading ? (
              <div className="text-on-surface-variant">Loading top URLs...</div>
            ) : analytics?.urls?.length === 0 ? (
              <div className="text-on-surface-variant">No URLs created yet.</div>
            ) : (
              analytics?.urls?.map((url, i) => (
                <div key={url.id}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-label-md text-label-md text-on-surface truncate pr-4">{getShortLinkBaseUrl().replace(/^https?:\/\//, '')}/{url.short_code}</span>
                    <span className="font-label-md text-label-md text-on-surface-variant">{url.click_count || 0}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: `${Math.min(((url.click_count || 0) / (analytics.topLinkClicks || 1)) * 100, 100)}%`}}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
