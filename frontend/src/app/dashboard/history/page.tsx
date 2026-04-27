'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

interface SalesPage {
  id: number;
  product_name: string;
  description: string;
  created_at: string;
}

export default function HistoryPage() {
  const [pages, setPages] = useState<SalesPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchPages = async () => {
    try {
      const response = await api.get('/api/auth/sales-pages');
      setPages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus sales page ini?')) return;
    
    setActionLoading(id);
    try {
      await api.delete(`/api/auth/sales-pages/${id}`);
      setPages(pages.filter(page => page.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Gagal menghapus data.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async (id: number) => {
    if (!confirm('Regenerate akan membuat ulang konten menggunakan AI. Lanjutkan?')) return;
    
    setActionLoading(id);
    try {
      await api.put(`/api/auth/sales-pages/${id}/regenerate`);
      alert('Berhasil di-regenerate!');
    } catch (error) {
      console.error('Failed to regenerate:', error);
      alert('Gagal me-regenerate data.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Riwayat Sales Page</h1>
            <p className="text-white/50 text-sm">Daftar halaman penawaran yang telah di-generate oleh AI.</p>
          </div>
          <Link
            href="/dashboard/generate"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/10 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Baru
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
            <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-white/60 mb-6">Belum ada history sales page.</p>
            <Link href="/dashboard/generate" className="text-violet-400 hover:text-violet-300 font-medium">
              Mulai generate sekarang &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {pages.map((page) => (
              <div key={page.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/10 transition-colors">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{page.product_name}</h3>
                  <p className="text-white/50 text-sm mb-3 line-clamp-1">{page.description}</p>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded-md">
                    {new Date(page.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href={`/dashboard/preview/${page.id}`}
                    className="flex-1 sm:flex-none text-center px-4 py-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRegenerate(page.id)}
                    disabled={actionLoading === page.id}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === page.id ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Regenerate'}
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    disabled={actionLoading === page.id}
                    className="p-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
