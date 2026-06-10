"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#D0BCFF', '#CCC2DC', '#4A4458', '#E8DEF8', '#FFB4AB'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await apiClient.get('/stats');
      setData(res.data.data);
    } catch (err) {
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const { summary, clicksOverTime, topDevices, topBrowsers, topLocations } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">
          Account Analytics
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Aggregate performance across all your short links
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-surface-container border border-white/5 rounded-2xl">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Total Links</p>
          <p className="font-display-sm text-display-sm font-bold text-primary">{summary.totalLinks}</p>
        </div>
        <div className="p-6 bg-surface-container border border-white/5 rounded-2xl">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Total Clicks</p>
          <p className="font-display-sm text-display-sm font-bold text-primary">{summary.totalClicks}</p>
        </div>
        <div className="p-6 bg-surface-container border border-white/5 rounded-2xl">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Avg Clicks / Link</p>
          <p className="font-display-sm text-display-sm font-bold text-primary">{summary.avgClicks}</p>
        </div>
      </div>

      {/* Clicks Over Time */}
      <div className="p-6 bg-surface-container border border-white/5 rounded-2xl h-[450px] flex flex-col">
        <h3 className="font-title-md text-title-md font-medium text-on-surface mb-6">Clicks Over Time (Last 30 Days)</h3>
        {clicksOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={clicksOverTime} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1C1B1F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#D0BCFF' }}
              />
              <Line type="monotone" dataKey="clicks" stroke="#D0BCFF" strokeWidth={3} dot={{ r: 4, fill: '#D0BCFF' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-on-surface-variant">
            No click data available yet.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Browsers */}
        <div className="p-6 bg-surface-container border border-white/5 rounded-2xl h-[400px] flex flex-col">
          <h3 className="font-title-md text-title-md font-medium text-on-surface mb-2">Top Browsers</h3>
          {topBrowsers.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={topBrowsers} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {topBrowsers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1C1B1F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-grow flex items-center justify-center text-on-surface-variant">No browser data.</div>
          )}
        </div>

        {/* Top Devices */}
        <div className="p-6 bg-surface-container border border-white/5 rounded-2xl h-[400px] flex flex-col">
          <h3 className="font-title-md text-title-md font-medium text-on-surface mb-2">Top Devices</h3>
          {topDevices.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={topDevices} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {topDevices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1C1B1F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-grow flex items-center justify-center text-on-surface-variant">No device data.</div>
          )}
        </div>
      </div>

      {/* Top Locations List */}
      <div className="p-6 bg-surface-container border border-white/5 rounded-2xl">
        <h3 className="font-title-md text-title-md font-medium text-on-surface mb-4">Top Locations</h3>
        {topLocations.length > 0 ? (
          <div className="space-y-4">
            {topLocations.map((loc, index) => (
              <div key={index} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="font-body-md text-on-surface">{loc.name}</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-label-sm font-medium">
                  {loc.value} clicks
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-on-surface-variant">No location data available yet.</div>
        )}
      </div>
    </div>
  );
}
