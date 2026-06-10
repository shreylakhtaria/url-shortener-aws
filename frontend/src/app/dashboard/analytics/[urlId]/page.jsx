"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient, getShortLinkBaseUrl } from '@/lib/axios';

export default function AnalyticsPage() {
  const { urlId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch specific URL analytics
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient.get(`/stats/${urlId}`);
        const data = res.data.data;
        
        setAnalytics({
          shortUrl: `${getShortLinkBaseUrl().replace(/^https?:\/\//, '')}/${data.shortCode}`,
          originalUrl: data.originalUrl,
          totalClicks: data.totalClicks || 0,
          recentClicks: data.recentClicks || 0,
          conversionRate: 'N/A', // not available from backend
          devices: { mobile: 0, desktop: 0, tablet: 0 },
          referrers: []
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [urlId]);

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">URL Analytics</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Viewing performance for <span className="text-primary font-medium">{loading ? '...' : analytics?.shortUrl}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container border border-white/5 p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded text-label-sm font-label-sm text-on-surface bg-surface-bright shadow-sm">7 Days</button>
          <button className="px-4 py-1.5 rounded text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface">30 Days</button>
          <button className="px-4 py-1.5 rounded text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface">All Time</button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
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
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{loading ? '...' : analytics?.recentClicks} in last 7 days</p>
        </div>

        {/* Stat Card 2 */}
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/10 rounded-full blur-2xl group-hover:bg-tertiary/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Conversion Rate</span>
            <div className="p-1.5 rounded-md bg-tertiary/10 text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              <span className="font-label-sm text-label-sm">+2.1%</span>
            </div>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">{loading ? '...' : analytics?.conversionRate}</div>
        </div>
      </div>

      {/* Additional Data Grid */}
      <div className="grid grid-cols-1 gap-gutter mt-6">
        {/* Traffic Sources */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-6 border-b border-white/5 pb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">Referrers</h3>
          </div>
          <div className="space-y-4">
            {!loading && analytics?.referrers?.length > 0 ? analytics.referrers.map((ref, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded ${ref.bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${ref.color} text-sm`}>{ref.icon}</span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface">{ref.name}</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface">{ref.percentage}%</span>
              </div>
            )) : (
              <div className="text-on-surface-variant font-body-sm text-body-sm text-center py-4">No referrer data available yet.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
