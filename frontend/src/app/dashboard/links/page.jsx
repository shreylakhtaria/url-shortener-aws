"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/axios';

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  
  // Computed stats
  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, curr) => acc + (curr.click_count || 0), 0);
  const sortedLinks = [...links].sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
  const topLink = sortedLinks[0];

  useEffect(() => {
    // In a real implementation, we would fetch URLs from the backend
    const fetchLinks = async () => {
      try {
        const res = await apiClient.get('/urls');
        setLinks(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch links', err);
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const handleCreateLink = async (e) => {
    e.preventDefault();
    if (!newUrl) return;
    setCreateLoading(true);
    setCreateError('');
    try {
      const payload = { originalUrl: newUrl };
      if (customAlias.trim()) {
        payload.customAlias = customAlias.trim();
      }
      const res = await apiClient.post('/urls', payload);
      // Prepend to list or re-fetch
      setLinks([res.data.data, ...links]);
      setIsModalOpen(false);
      setNewUrl('');
      setCustomAlias('');
    } catch (err) {
      console.error(err);
      setCreateError(err.response?.data?.message || 'Failed to create link');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCopy = (shortCode, id) => {
    navigator.clipboard.writeText(`localhost:5000/${shortCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">My Links</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Manage your short links, track performance, and create new ones.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-white/15 bg-transparent hover:bg-white/5 text-on-surface font-label-md text-label-md transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Last 7 Days
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-primary-container text-white font-label-md text-label-md hover:shadow-[0_0_15px_rgba(208,188,255,0.4)] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create Link
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="glass-card border border-white/10 rounded-xl p-stack-md relative overflow-hidden group hover:border-white/25 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-md text-label-md text-on-surface-variant">Total Links</span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md">link</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface">{loading ? '...' : totalLinks}</div>
          <div className="flex items-center gap-1 mt-2 text-tertiary font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[14px]">link</span>
            <span>Total created</span>
          </div>
        </div>
        <div className="glass-card border border-white/10 rounded-xl p-stack-md relative overflow-hidden group hover:border-white/25 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary-container/5 rounded-full blur-2xl group-hover:bg-secondary-container/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-md text-label-md text-on-surface-variant">Total Clicks</span>
            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-1.5 rounded-md">ads_click</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface">{loading ? '...' : totalClicks.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-2 text-tertiary font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>Engagement</span>
          </div>
        </div>
        <div className="glass-card border border-white/10 rounded-xl p-stack-md relative overflow-hidden group hover:border-white/25 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-tertiary-container/5 rounded-full blur-2xl group-hover:bg-tertiary-container/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-md text-label-md text-on-surface-variant">Active Links</span>
            <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-1.5 rounded-md">check_circle</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-on-surface">{loading ? '...' : totalLinks}</div>
          <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
            <span>100% of total</span>
          </div>
        </div>
        <div className="glass-card border border-white/10 rounded-xl p-stack-md relative overflow-hidden group hover:border-white/25 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-outline-variant/10 rounded-full blur-2xl group-hover:bg-outline-variant/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-md text-label-md text-on-surface-variant">Top Link</span>
            <span className="material-symbols-outlined text-on-surface bg-surface-variant p-1.5 rounded-md">public</span>
          </div>
          <div className="font-body-lg text-body-lg text-on-surface truncate pr-4">
            {loading ? '...' : (topLink ? `localhost:5000/${topLink.short_code}` : 'N/A')}
          </div>
          <div className="flex items-center gap-1 mt-3 font-label-sm text-label-sm">
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              {loading ? '...' : (topLink ? topLink.click_count : 0)} CLICKS
            </span>
          </div>
        </div>
      </div>

      {/* Links Table */}
      <div className="glass-card border border-white/10 rounded-xl overflow-hidden">
        <div className="p-stack-md border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="font-headline-md text-headline-md text-on-surface text-lg">All Links</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-3 px-stack-md font-label-sm text-label-sm text-on-surface-variant border-b border-white/5 bg-surface-container-low">Short Link</th>
                <th className="py-3 px-stack-md font-label-sm text-label-sm text-on-surface-variant border-b border-white/5 bg-surface-container-low">Original URL</th>
                <th className="py-3 px-stack-md font-label-sm text-label-sm text-on-surface-variant border-b border-white/5 bg-surface-container-low text-right">Clicks</th>
                <th className="py-3 px-stack-md font-label-sm text-label-sm text-on-surface-variant border-b border-white/5 bg-surface-container-low w-24">Status</th>
                <th className="py-3 px-stack-md font-label-sm text-label-sm text-on-surface-variant border-b border-white/5 bg-surface-container-low w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-on-surface-variant">Loading links...</td>
                </tr>
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-on-surface-variant">No links found. Create one to get started!</td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                    <td className="py-4 px-stack-md">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-label-md">localhost:5000/{link.short_code}</span>
                        <button 
                          onClick={() => handleCopy(link.short_code, link.id)}
                          className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-white transition-all"
                          title="Copy to clipboard"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {copiedId === link.id ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-stack-md text-on-surface-variant truncate max-w-[200px] md:max-w-[400px]">
                      {link.original_url}
                    </td>
                    <td className="py-4 px-stack-md text-right font-label-sm text-on-surface">{link.click_count?.toLocaleString() || 0}</td>
                    <td className="py-4 px-stack-md">
                        <span className="inline-flex items-center px-2 py-0.5 rounded border border-tertiary/20 bg-tertiary/10 text-tertiary font-label-sm text-[10px] uppercase">
                          Active
                        </span>
                    </td>
                    <td className="py-4 px-stack-md">
                      <a href={`/dashboard/analytics/${link.id}`} className="text-primary hover:text-white transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">analytics</span>
                        <span className="font-label-sm">Stats</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Create Link Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Create New Link</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Enter your long URL to generate a trackable short link.</p>
            
            <form onSubmit={handleCreateLink}>
              <div className="mb-4">
                <label className="block font-label-sm text-label-sm text-on-surface mb-2">Original URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://example.com/very/long/url"
                  className="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-label-sm text-label-sm text-on-surface mb-2">Custom Alias <span className="text-on-surface-variant font-normal">(Optional)</span></label>
                <div className="flex items-center">
                  <span className="bg-surface-container-highest border border-white/10 border-r-0 rounded-l-lg px-3 py-3 text-on-surface-variant font-body-md">
                    localhost:5000/
                  </span>
                  <input 
                    type="text"
                    placeholder="my-campaign"
                    className="w-full bg-surface-container border border-white/10 rounded-r-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                  />
                </div>
              </div>
              {createError && (
                <div className="text-error font-body-sm text-body-sm mb-4">{createError}</div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-on-surface hover:bg-white/5 transition-colors font-label-md"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 rounded-lg bg-primary-container text-white font-label-md hover:bg-primary-container/80 transition-colors disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Shorten'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
