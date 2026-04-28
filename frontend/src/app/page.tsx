'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    api.get('/api/auth/user')
      .then(() => {
        // If request is successful, user is logged in
        router.push('/dashboard');
      })
      .catch(() => {
        // If request fails (401 Unauthorized), user is not logged in
        router.push('/login');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Memeriksa status login...</p>
      </div>
    </div>
  );
}
