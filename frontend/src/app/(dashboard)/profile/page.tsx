'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/FormField';
import { LoadingButton } from '@/components/LoadingButton';
import { ErrorAlert } from '@/components/ErrorAlert';
import api from '@/services/api';

export default function ProfilePage() {
  const { user, logout, getProfile } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);

  // Edit profile states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Change password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<{ message: string; errors?: string[] } | null>(null);

  // Load complete profile from backend on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfileData(data);
        setName(data.name || '');
        setBio(data.bio || '');
      } catch (err) {
        console.error('Failed to load user profile details.', err);
      }
    }
    loadProfile();
  }, [getProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    if (!name.trim()) {
      setProfileError('Name is required.');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await api.patch('/auth/profile', { name, bio });
      const updatedUser = response.data.data;
      setProfileData(updatedUser);
      
      // Update store user info by writing to storage
      if (typeof window !== 'undefined') {
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          parsed.name = updatedUser.name;
          parsed.bio = updatedUser.bio;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      }

      setProfileMessage('Profile updated successfully!');
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError({ message: 'All password fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError({ message: 'New passwords do not match.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.put('/auth/password', { oldPassword, newPassword });
      setPasswordMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to change password.';
      const errors = err.response?.data?.errors || [];
      setPasswordError({ message: msg, errors });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user && !profileData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f1419] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 dark:text-slate-400 text-sm">Loading profile...</span>
        </div>
      </div>
    );
  }

  const currentUser = profileData || user;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f1419] text-slate-100 p-4 md:p-8 relative">
      {/* Accent Blur Orbs */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-[#10b981]/30">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Manage your personal information, credentials, and track your coding activity.
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2.5 bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#10b981]/20 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-red-500/30 rounded-lg text-sm transition duration-200 flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Info & Statistics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Info Summary Card */}
            <div className="bg-white/30 dark:bg-[#1a2332]/30 border border-slate-200 dark:border-[#10b981]/30/80 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg ring-4 ring-emerald-500/10">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <span className="px-2.5 py-0.5 mt-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                  {currentUser.role}
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 px-2 italic">
                  {currentUser.bio || '"No bio written yet."'}
                </p>
              </div>

              <div className="mt-6 space-y-3.5 border-t border-slate-200 dark:border-[#10b981]/30 pt-6 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-200">{currentUser.email}</span>
                </div>
                {currentUser.roll_no && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Roll Number</span>
                    <span className="font-medium text-slate-200">{currentUser.roll_no}</span>
                  </div>
                )}
                {currentUser.department && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department</span>
                    <span className="font-medium text-slate-200">{currentUser.department}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Coding Stats Placeholder Card */}
            <div className="bg-white/30 dark:bg-[#1a2332]/30 border border-slate-200 dark:border-[#10b981]/30/80 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                Activity Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0f1419]/40 border border-slate-200 dark:border-[#10b981]/30 rounded-xl">
                  <span className="block text-xs text-slate-500 font-medium">Solved</span>
                  <span className="block text-2xl font-bold text-green-400 mt-1">0</span>
                  <span className="text-[10px] text-slate-500">questions</span>
                </div>
                <div className="p-4 bg-[#0f1419]/40 border border-slate-200 dark:border-[#10b981]/30 rounded-xl">
                  <span className="block text-xs text-slate-500 font-medium">Submissions</span>
                  <span className="block text-2xl font-bold text-emerald-400 mt-1">0</span>
                  <span className="text-[10px] text-slate-500">total runs</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-purple-950/10 border border-emerald-500/10 rounded-xl text-center text-xs text-emerald-400">
                Solve coding questions to track progress metrics!
              </div>
            </div>
          </div>

          {/* Right panel: Edit Profile & Password Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            <div className="bg-white/30 dark:bg-[#1a2332]/30 border border-slate-200 dark:border-[#10b981]/30/80 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </h3>

              {profileMessage && (
                <div className="p-3 bg-green-950/40 border border-green-500/20 text-green-300 rounded-lg text-sm mb-4 animate-slideDown">
                  {profileMessage}
                </div>
              )}
              {profileError && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-300 rounded-lg text-sm mb-4 animate-slideDown">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <FormField
                  id="profile-name"
                  name="name"
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div className="mb-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    className="w-full px-3.5 py-2 bg-white/60 dark:bg-[#1a2332]/60 border border-slate-200 dark:border-[#10b981]/20 focus:border-emerald-500/60 focus:ring-emerald-500/20 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-200 backdrop-blur-sm"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <LoadingButton type="submit" isLoading={isUpdatingProfile} className="w-auto px-6">
                    Save Changes
                  </LoadingButton>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white/30 dark:bg-[#1a2332]/30 border border-slate-200 dark:border-[#10b981]/30/80 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zM7 7a3 3 0 016 0v2H7V7z" clipRule="evenodd" />
                </svg>
                Change Password
              </h3>

              {passwordMessage && (
                <div className="p-3 bg-green-950/40 border border-green-500/20 text-green-300 rounded-lg text-sm mb-4 animate-slideDown">
                  {passwordMessage}
                </div>
              )}
              <ErrorAlert message={passwordError?.message} errors={passwordError?.errors} />

              <form onSubmit={handleChangePassword} className="space-y-4">
                <FormField
                  id="oldPassword"
                  name="oldPassword"
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />

                <FormField
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <FormField
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <div className="flex justify-end">
                  <LoadingButton type="submit" isLoading={isChangingPassword} className="w-auto px-6">
                    Update Password
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
