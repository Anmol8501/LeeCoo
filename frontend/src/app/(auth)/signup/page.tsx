'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/FormField';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { LoadingButton } from '@/components/LoadingButton';
import { ErrorAlert } from '@/components/ErrorAlert';

const DEPARTMENTS = [
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'ECE', label: 'Electronics & Communication Engineering' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'ME', label: 'Mechanical Engineering' },
  { value: 'EE', label: 'Electrical Engineering' },
  { value: 'CE', label: 'Civil Engineering' },
];

export default function SignupPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roll_no: '',
    department: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<{ message: string; errors?: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  // Restore draft from localStorage on load
  useEffect(() => {
    const savedDraft = localStorage.getItem('signup_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({
          ...prev,
          name: parsed.name || '',
          email: parsed.email || '',
          roll_no: parsed.roll_no || '',
          department: parsed.department || '',
        }));
        if (parsed.role) {
          setRole(parsed.role);
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  // Save draft to localStorage on form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Save draft omitting passwords
    localStorage.setItem(
      'signup_draft',
      JSON.stringify({
        name: newFormData.name,
        email: newFormData.email,
        roll_no: newFormData.roll_no,
        department: newFormData.department,
        role,
      })
    );

    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleRoleChange = (newRole: 'student' | 'teacher') => {
    setRole(newRole);
    // Clear roll number if changing to teacher
    if (newRole === 'teacher') {
      setFormData((prev) => ({ ...prev, roll_no: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (role === 'student') {
      if (!formData.roll_no.trim()) {
        errors.roll_no = 'Roll number is required.';
      } else if (!/^[A-Za-z0-9]+$/.test(formData.roll_no)) {
        errors.roll_no = 'Roll number must contain alphanumeric characters only.';
      }
    }

    if (!formData.department) {
      errors.department = 'Please select a department.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!isTermsAccepted) {
      errors.terms = 'You must accept the terms & conditions.';
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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roll_no: role === 'student' ? formData.roll_no : undefined,
        department: formData.department,
        role,
      });

      // Clear draft on successful register
      localStorage.removeItem('signup_draft');
      router.push('/profile');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to complete registration.';
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
            Create Account
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Join CodeLearn and start programming
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-lg mb-6 border border-slate-900">
          <button
            type="button"
            className={`py-1.5 text-sm font-medium rounded-md transition duration-200 ${
              role === 'student'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => handleRoleChange('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={`py-1.5 text-sm font-medium rounded-md transition duration-200 ${
              role === 'teacher'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => handleRoleChange('teacher')}
          >
            Teacher
          </button>
        </div>

        <ErrorAlert message={apiError?.message} errors={apiError?.errors} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="name"
            name="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            required
          />

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

          {role === 'student' && (
            <FormField
              id="roll_no"
              name="roll_no"
              label="Roll Number"
              type="text"
              placeholder="20CSE045"
              value={formData.roll_no}
              onChange={handleInputChange}
              error={formErrors.roll_no}
              required
            />
          )}

          {/* Department Selection */}
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-slate-300 mb-1.5"
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              className={`w-full px-3.5 py-2 bg-slate-900/60 border ${
                formErrors.department
                  ? 'border-red-500/80 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-purple-500/60 focus:ring-purple-500/20'
              } rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-200 backdrop-blur-sm`}
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled className="bg-slate-950 text-slate-500">Select department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.value} value={dept.value} className="bg-slate-950 text-slate-200">
                  {dept.label} ({dept.value})
                </option>
              ))}
            </select>
            {formErrors.department && (
              <p className="mt-1 text-xs text-red-400 font-medium">{formErrors.department}</p>
            )}
          </div>

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

          <PasswordStrengthIndicator password={formData.password} />

          <FormField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={formErrors.confirmPassword}
            required
          />

          {/* Terms checkbox */}
          <div className="flex flex-col">
            <label className="flex items-start gap-2.5 cursor-pointer text-slate-400 select-none text-xs">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-slate-800 bg-slate-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900 cursor-pointer"
                checked={isTermsAccepted}
                onChange={(e) => {
                  setIsTermsAccepted(e.target.checked);
                  if (formErrors.terms) {
                    setFormErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.terms;
                      return updated;
                    });
                  }
                }}
              />
              <span>
                I agree to the{' '}
                <span className="text-purple-400 hover:text-purple-300 font-medium">Terms of Service</span>{' '}
                and{' '}
                <span className="text-purple-400 hover:text-purple-300 font-medium">Privacy Policy</span>.
              </span>
            </label>
            {formErrors.terms && (
              <p className="mt-1 text-xs text-red-400 font-medium animate-fadeIn">{formErrors.terms}</p>
            )}
          </div>

          <LoadingButton type="submit" isLoading={isLoading} className="mt-2">
            Sign Up
          </LoadingButton>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition duration-200">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
