'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/FormField';
import { LoadingButton } from '@/components/LoadingButton';
import { ErrorAlert } from '@/components/ErrorAlert';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<{ message: string; errors?: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      router.push('/profile');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      const errors = err.response?.data?.errors || [];
      setApiError({ message: msg, errors });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-purple-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Log in to your CodeLearn account
          </p>
        </div>

        <ErrorAlert message={apiError?.message} errors={apiError?.errors} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="john.doe@college.edu"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            required
          />

          <FormField
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            required
          />

          <div className="flex justify-end text-xs mb-2">
            <span className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer transition duration-200">
              Forgot Password?
            </span>
          </div>

          <LoadingButton type="submit" isLoading={isLoading}>
            Log In
          </LoadingButton>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition duration-200">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
