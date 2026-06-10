"use client";
import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { apiClient } from '@/lib/axios';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('security');

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState({ type: '', text: '' });

  // Danger Zone State
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setSecurityLoading(true);
    setSecurityMessage({ type: '', text: '' });
    try {
      await apiClient.put('/users/password', { currentPassword, newPassword });
      setSecurityMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setSecurityMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure? This will delete your account and ALL your short links forever. This action cannot be undone.')) {
      setDeleteLoading(true);
      try {
        await apiClient.delete('/users/account');
        logout();
        window.location.href = '/';
      } catch (err) {
        alert('Failed to delete account. Please try again.');
        setDeleteLoading(false);
      }
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display-lg text-display-lg text-on-surface">Account Settings</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Manage your profile, security, and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-px">

        <button 
          onClick={() => setActiveTab('security')}
          className={`px-6 py-3 font-label-md text-label-md transition-colors whitespace-nowrap border-b-2 ${activeTab === 'security' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            Security
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('danger')}
          className={`px-6 py-3 font-label-md text-label-md transition-colors whitespace-nowrap border-b-2 ${activeTab === 'danger' ? 'border-error text-error' : 'border-transparent text-on-surface-variant hover:text-error'}`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            Danger Zone
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl">
        {activeTab === 'security' && (
          <div className="glass-card rounded-xl p-8">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Change Password</h3>

            {securityMessage.text && (
              <div className={`p-4 rounded-lg mb-6 text-sm ${securityMessage.type === 'error' ? 'bg-error/10 text-error border border-error/20' : 'bg-success/10 text-success border border-success/20'}`}>
                {securityMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <button 
                type="submit" 
                disabled={securityLoading}
                className="bg-primary text-on-primary font-label-lg py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {securityLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="glass-card border-error/20 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
            <h3 className="font-headline-md text-headline-md text-error mb-2">Delete Account</h3>
            <p className="text-on-surface-variant text-body-md mb-6">
              Once you delete your account, there is no going back. Please be certain. All of your short links will be permanently deleted and will stop redirecting immediately.
            </p>
            <button 
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="bg-error/10 text-error border border-error/20 hover:bg-error/20 font-label-lg py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[20px]">delete_forever</span>
              {deleteLoading ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
