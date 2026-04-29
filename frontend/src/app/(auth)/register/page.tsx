'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/axios';
import Cookies from 'js-cookie';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const { data } = await api.post('/api/auth/register', form);
      Cookies.set('auth_token', data.token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production' 
      });
      router.push('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // Validation errors from Laravel (422)
        const flat: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
          flat[key] = (msgs as string[])[0];
        }
        setErrors(flat);
      } else if (err.response?.data?.message) {
        // General API error with message
        setErrors({ general: err.response.data.message });
      } else if (err.message) {
        // Axios/Network error (e.g., CORS, server down)
        setErrors({ general: `Connection error: ${err.message}` });
      } else {
        setErrors({ general: 'Terjadi kesalahan sistem yang tidak diketahui.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const fields: { id: string; label: string; type: string; placeholder: string; autoComplete: string }[] = [
    { id: 'name', label: 'Full name', type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
    { id: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
    { id: 'password_confirmation', label: 'Confirm password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-4 shadow-lg shadow-violet-500/30">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create an account</h1>
        <p className="mt-1 text-sm text-white/50">Join us and get started today</p>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map(({ id, label, type, placeholder, autoComplete }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-white/70 mb-1.5">
              {label}
            </label>
            <input
              id={id}
              name={id}
              type={type}
              autoComplete={autoComplete}
              value={form[id as keyof typeof form]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors[id]
                  ? 'border-red-500/50 focus:ring-red-500/30'
                  : 'border-white/10 focus:ring-violet-500/50 focus:border-violet-500/50'
              }`}
            />
            {errors[id] && <p className="mt-1.5 text-xs text-red-400">{errors[id]}</p>}
          </div>
        ))}

        {/* Submit */}
        <button
          id="register-submit"
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-white/40">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
