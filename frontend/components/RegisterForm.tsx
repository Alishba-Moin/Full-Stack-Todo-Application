'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ErrorMessage } from './ui/ErrorMessage';
import { register } from '@/lib/auth';
import { EnvelopeIcon, LockClosedIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await register(email, password);

      if (result.success) {
        router.push('/login?message=Registration successful! Please log in.');
      } else {
        setGeneralError(result.message);
      }
    } catch (error) {
      setGeneralError('Unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-lg space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
        Create Your Account
      </h2>
      <p className="text-center text-gray-500 text-sm">
        Sign up and power your day with <span className="font-semibold text-yellow-500">Task</span>!
      </p>

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
          placeholder="At least 8 characters"
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
          helperText="Use at least 8 characters"
          disabled={isLoading}
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          icon={<LockClosedIcon className="w-5 h-5 text-pink-500" />}
          actionIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Toggle confirm password visibility"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          }
          disabled={isLoading}
        />

        {/* Submit */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full py-3 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-md transition"
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <span
          onClick={() => router.push('/login')}
          className="text-pink-500 font-semibold cursor-pointer hover:underline"
        >
          Sign In
        </span>
      </p>
    </div>
  );
}
