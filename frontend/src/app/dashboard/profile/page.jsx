"use client";
import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfilePage() {
  const { user, initialize } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@shortlink.dev',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call, then update local store
    setTimeout(() => {
      // In a real app we would send this to the backend
      // and update the cookie user object
      setIsSaving(false);
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-gutter relative w-full">
      {/* Vertical Sub-Navigation */}
      <aside className="w-full lg:w-64 flex-shrink-0 mb-8 lg:mb-0">
        <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide sticky lg:top-[120px]">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-shrink-0 text-left px-4 py-3 rounded-lg font-label-md text-label-md flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-surface-container border border-white/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Profile &amp; Account
          </button>
        </nav>
      </aside>

      {/* Settings Sections Container */}
      <div className="flex-1 space-y-stack-lg max-w-3xl">
        {/* Profile Section */}
        <section id="profile" className="glass-panel rounded-xl p-8 shadow-lg bg-surface-container-low/50 border border-white/5 backdrop-blur-md">
          <div className="border-b border-white/5 pb-4 mb-6">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Profile</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Update your personal information and public avatar.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="h-24 w-24 rounded-full bg-surface-container-highest border-2 border-surface-container flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                  <div className="h-full w-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold opacity-90 group-hover:opacity-50 transition-opacity">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="material-symbols-outlined text-white text-2xl drop-shadow-md">photo_camera</span>
                </div>
              </div>
              <button className="text-primary font-label-sm text-label-sm hover:text-primary-fixed transition-colors">Change Avatar</button>
            </div>
            {/* Form Fields */}
            <div className="flex-1 space-y-5 w-full">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0b]/80 border border-white/10 rounded-lg px-4 py-2.5 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all focus:outline-none"
                  placeholder="Enter your name"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Email Address</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0b]/80 border border-white/10 rounded-lg px-4 py-2.5 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all focus:outline-none"
                  placeholder="Enter your email"
                  type="email"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-xs">Used for login and important notifications.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-end gap-4">
            {saveMessage && <span className="text-primary font-body-sm text-body-sm transition-opacity">{saveMessage}</span>}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:shadow-[0_0_15px_rgba(208,188,255,0.4)] transition-all font-medium disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
