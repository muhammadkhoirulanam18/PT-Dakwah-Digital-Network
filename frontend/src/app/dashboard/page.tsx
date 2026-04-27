'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (!token) {
      router.replace('/login');
      return;
    }

    api
      .get('/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setUser(data))
      .catch(() => {
        Cookies.remove('auth_token');
        router.replace('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    const token = Cookies.get('auth_token');
    try {
      await api.post(
        '/api/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } finally {
      Cookies.remove('auth_token');
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="relative border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-white text-sm">PT Dakwah Digital</span>
          </div>

          <button
            id="logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 hover:bg-white/5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Welcome card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
              <span className="text-white font-bold text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Welcome back, {user?.name}!</h1>
              <p className="text-white/50 text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'User ID', value: `#${user?.id}`, icon: '🪪' },
            { label: 'Status', value: 'Active', icon: '✅' },
            { label: 'Role', value: 'Member', icon: '👤' },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 hover:border-white/15 transition-all duration-200"
            >
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-white/40 text-xs uppercase tracking-wider font-medium">{label}</p>
              <p className="text-white font-semibold mt-1">{value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
