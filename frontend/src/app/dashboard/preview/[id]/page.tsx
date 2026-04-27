'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';

interface GeneratedContent {
  headline?: string;
  subheadline?: string;
  benefits?: string[];
  features?: string[];
  testimonial?: string;
  pricing?: string;
  cta?: string;
}

interface SalesPage {
  id: number;
  product_name: string;
  generated_content: GeneratedContent;
}

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<SalesPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    api.get(`/api/auth/sales-pages/${params.id}`)
      .then(response => {
        setData(response.data.data);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Gagal memuat data sales page.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Memuat preview...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
          <p className="mb-4">{error || 'Data tidak ditemukan.'}</p>
          <button onClick={() => router.push('/dashboard/generate')} className="text-white/70 hover:text-white underline text-sm">
            Kembali ke Form
          </button>
        </div>
      </div>
    );
  }

  const content = data.generated_content || {};

  const handleExportHTML = () => {
    if (!data) return;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.product_name} - Sales Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #0a0a0f; color: white; font-family: sans-serif; }
    </style>
</head>
<body class="selection:bg-violet-500/30">
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
    </div>
    <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-24">
        
        <section class="text-center pt-10 pb-4">
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                ${content.headline || 'Your Headline Here'}
            </h1>
            <p class="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
                ${content.subheadline || 'Subheadline will appear here...'}
            </p>
        </section>

        ${content.benefits && content.benefits.length > 0 ? `
        <section class="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
            <h2 class="text-2xl md:text-3xl font-bold mb-10 text-center">Kenapa Memilih Kami?</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${content.benefits.map(benefit => `
                <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div class="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <p class="text-white/80">${benefit}</p>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${content.features && content.features.length > 0 ? `
        <section>
            <h2 class="text-2xl md:text-3xl font-bold mb-10 text-center">Fitur Unggulan</h2>
            <div class="space-y-4 max-w-3xl mx-auto">
                ${content.features.map(feature => `
                <div class="flex items-start gap-4 p-4 rounded-xl">
                    <div class="mt-1 flex-shrink-0 text-indigo-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <p class="text-lg text-white/90">${feature}</p>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${content.testimonial ? `
        <section class="max-w-4xl mx-auto">
            <blockquote class="relative p-8 md:p-12 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border border-violet-500/20 rounded-3xl text-center">
                <p class="text-xl md:text-2xl font-medium italic text-white/90 relative z-10 leading-relaxed">
                    "${content.testimonial}"
                </p>
                <div class="mt-6 flex items-center justify-center gap-3">
                    <div class="text-left">
                        <p class="font-semibold text-white/90">Pelanggan Puas</p>
                    </div>
                </div>
            </blockquote>
        </section>
        ` : ''}

        ${content.pricing ? `
        <section class="flex justify-center">
            <div class="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
                <h2 class="text-2xl font-bold mb-2">Harga Spesial</h2>
                <div class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 my-6">
                    ${content.pricing}
                </div>
                <button class="w-full py-4 rounded-xl bg-white text-black font-bold">
                    Dapatkan Sekarang
                </button>
            </div>
        </section>
        ` : ''}

        <section class="text-center py-12 md:py-20">
            <h2 class="text-3xl md:text-5xl font-bold mb-8">${content.cta || 'Siap untuk memulai?'}</h2>
            <button class="px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg">
                Ambil Penawaran Terbatas Ini
            </button>
        </section>

    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.product_name.replace(/\s+/g, '-').toLowerCase()}-sales-page.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-violet-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Navigation / Header */}
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <span className="font-semibold text-white/90 text-sm border-l border-white/20 pl-3">
                Preview: {data.product_name}
              </span>
            </div>
            <button
              onClick={handleExportHTML}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export HTML
            </button>
          </div>
        </header>

        {/* Landing Page Content */}
        <main className="max-w-5xl mx-auto px-4 py-12 space-y-24">
          
          {/* Hero Section */}
          <section className="text-center pt-10 pb-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              {content.headline || 'Your Headline Here'}
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
              {content.subheadline || 'Subheadline will appear here...'}
            </p>
          </section>

          {/* Benefits Section */}
          {content.benefits && content.benefits.length > 0 && (
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Kenapa Memilih Kami?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.benefits.map((benefit, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white/80">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Features Section */}
          {content.features && content.features.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Fitur Unggulan</h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="mt-1 flex-shrink-0 text-indigo-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-lg text-white/90">{feature}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonial Section */}
          {content.testimonial && (
            <section className="max-w-4xl mx-auto">
              <blockquote className="relative p-8 md:p-12 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border border-violet-500/20 rounded-3xl text-center">
                <svg className="absolute top-6 left-6 w-10 h-10 text-violet-500/20" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-xl md:text-2xl font-medium italic text-white/90 relative z-10 leading-relaxed">
                  "{content.testimonial}"
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-white/50 text-sm">👤</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white/90">Pelanggan Puas</p>
                    <p className="text-sm text-white/50">Verified Buyer</p>
                  </div>
                </div>
              </blockquote>
            </section>
          )}

          {/* Pricing Section */}
          {content.pricing && (
            <section className="flex justify-center">
              <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 text-center relative overflow-hidden group hover:border-violet-500/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h2 className="text-2xl font-bold mb-2">Harga Spesial</h2>
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 my-6">
                  {content.pricing}
                </div>
                <p className="text-white/60 mb-8">Investasi terbaik untuk kebutuhan Anda hari ini.</p>
                <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-colors">
                  Dapatkan Sekarang
                </button>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="text-center py-12 md:py-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">{content.cta || 'Siap untuk memulai?'}</h2>
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105 active:scale-95">
              Ambil Penawaran Terbatas Ini
            </button>
          </section>

        </main>
      </div>
    </div>
  );
}
