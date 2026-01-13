'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ErrorMessage } from './ui/ErrorMessage';
import { login } from '@/lib/auth';
import { EnvelopeIcon, LockClosedIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) setSuccessMessage(message);

    const error = searchParams.get('error');
    if (error === 'session_expired') {
      setGeneralError('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        router.push('/');
      } else {
        setGeneralError(result.message);
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-lg space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
        Welcome Back
      </h2>
      <p className="text-center text-gray-500 text-sm">
        Sign in to continue your <span className="text-yellow-500 font-semibold">Task</span>
      </p>

      {successMessage && (
        <div
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md"
          role="status"
        >
          {successMessage}
        </div>
      )}

      {generalError && (
        <ErrorMessage message={generalError} onDismiss={() => setGeneralError('')} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          icon={<EnvelopeIcon className="w-5 h-5 text-yellow-500" />}
          disabled={isLoading}
        />

        {/* Password */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={<LockClosedIcon className="w-5 h-5 text-pink-500" />}
          actionIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Toggle password visibility"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          }
          disabled={isLoading}
        />
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full py-3 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-md transition"
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Don’t have an account?{' '}
        <span
          onClick={() => router.push('/register')}
          className="text-pink-500 font-semibold cursor-pointer hover:underline"
        >
          Create Account
        </span>
      </p>
    </div>
  );
}
