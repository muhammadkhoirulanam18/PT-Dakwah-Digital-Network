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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { background-color: #0a0a0f; color: white; font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="selection:bg-violet-500/30 antialiased text-white/80">
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
    </div>
    <div class="relative z-10 max-w-5xl mx-auto px-6 md:px-8 py-12">
        
        <section class="text-center py-20 md:py-32">
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent leading-[1.1]">
                ${content.headline || 'Your Headline Here'}
            </h1>
            <p class="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed font-medium">
                ${content.subheadline || 'Subheadline will appear here...'}
            </p>
        </section>

        ${Array.isArray(content.benefits) && content.benefits.length > 0 ? `
        <section class="py-16 md:py-24">
            <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight text-white">Kenapa Memilih Kami?</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                ${content.benefits?.map(benefit => `
                <div class="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.05] transition-all duration-300">
                    <div class="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6 text-violet-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <p class="text-white/70 leading-relaxed text-lg">${benefit}</p>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${Array.isArray(content.features) && content.features.length > 0 ? `
        <section class="py-16 md:py-24">
            <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight text-white">Fitur Unggulan</h2>
            <div class="space-y-4 md:space-y-6 max-w-3xl mx-auto">
                ${content.features?.map(feature => `
                <div class="flex items-start gap-5 p-6 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                    <div class="mt-1 flex-shrink-0 text-violet-400 p-2 bg-violet-500/10 rounded-xl">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <p class="text-xl text-white/90 font-medium leading-relaxed">${feature}</p>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${content.testimonial ? `
        <section class="py-16 md:py-24 max-w-4xl mx-auto">
            <blockquote class="relative p-10 md:p-16 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10 border border-white/10 rounded-[2.5rem] text-center overflow-hidden">
                <p class="text-2xl md:text-3xl font-medium italic text-white/90 relative z-10 leading-relaxed tracking-tight">
                    "${content.testimonial}"
                </p>
                <div class="mt-10 flex items-center justify-center gap-4">
                    <div class="text-center">
                        <p class="font-bold text-white text-lg">Pelanggan Puas</p>
                        <p class="text-violet-400 font-medium mt-1">Verified Buyer</p>
                    </div>
                </div>
            </blockquote>
        </section>
        ` : ''}

        ${content.pricing ? `
        <section class="py-16 md:py-24 flex justify-center">
            <div class="w-full max-w-lg p-10 md:p-12 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/20 text-center relative overflow-hidden group">
                <h2 class="text-2xl font-bold mb-4 text-white/80">Harga Spesial</h2>
                <div class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 my-8 tracking-tighter">
                    ${content.pricing}
                </div>
                <p class="text-lg text-white/60 mb-10">Investasi terbaik untuk kebutuhan Anda hari ini.</p>
                <button class="w-full py-5 rounded-2xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-transform active:scale-95 shadow-xl shadow-white/10">
                    Dapatkan Sekarang
                </button>
            </div>
        </section>
        ` : ''}

        <section class="text-center py-20 md:py-32">
            <h2 class="text-4xl md:text-6xl font-black mb-10 tracking-tight text-white">${content.cta || 'Siap untuk memulai?'}</h2>
            <button class="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg md:text-xl shadow-2xl shadow-violet-500/30 transition-all duration-300 hover:scale-105 active:scale-95">
                Ambil Penawaran Terbatas Ini
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
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
    <div className="min-h-screen bg-[#0a0a0f] text-white/80 selection:bg-violet-500/30 antialiased font-sans">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation / Header */}
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="flex flex-col">
                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Preview Mode</span>
                <span className="font-bold text-white text-sm">
                  {data.product_name}
                </span>
              </div>
            </div>
            <button
              onClick={handleExportHTML}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export HTML
            </button>
          </div>
        </header>

        {/* Landing Page Content */}
        <main className="max-w-5xl mx-auto px-6 md:px-8 py-12">
          
          {/* Hero Section */}
          <section className="text-center py-20 md:py-32">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent leading-[1.1]">
              {content.headline || 'Your Headline Here'}
            </h1>
            <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed font-medium">
              {content.subheadline || 'Subheadline will appear here...'}
            </p>
          </section>

          {/* Benefits Section */}
          {Array.isArray(content.benefits) && content.benefits.length > 0 && (
            <section className="py-16 md:py-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight text-white">Kenapa Memilih Kami?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {content.benefits?.map((benefit, index) => (
                  <div key={index} className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6 text-violet-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white/70 leading-relaxed text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Features Section */}
          {Array.isArray(content.features) && content.features.length > 0 && (
            <section className="py-16 md:py-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight text-white">Fitur Unggulan</h2>
              <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
                {content.features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-5 p-6 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                    <div className="mt-1 flex-shrink-0 text-violet-400 p-2 bg-violet-500/10 rounded-xl">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xl text-white/90 font-medium leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonial Section */}
          {content.testimonial && (
            <section className="py-16 md:py-24 max-w-4xl mx-auto">
              <blockquote className="relative p-10 md:p-16 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10 border border-white/10 rounded-[2.5rem] text-center overflow-hidden">
                <p className="text-2xl md:text-3xl font-medium italic text-white/90 relative z-10 leading-relaxed tracking-tight">
                  "{content.testimonial}"
                </p>
                <div className="mt-10 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="font-bold text-white text-lg">Pelanggan Puas</p>
                    <p className="text-violet-400 font-medium mt-1">Verified Buyer</p>
                  </div>
                </div>
              </blockquote>
            </section>
          )}

          {/* Pricing Section */}
          {content.pricing && (
            <section className="py-16 md:py-24 flex justify-center">
              <div className="w-full max-w-lg p-10 md:p-12 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/20 text-center relative overflow-hidden group hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4 text-white/80">Harga Spesial</h2>
                  <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 my-8 tracking-tighter">
                    {content.pricing}
                  </div>
                  <p className="text-lg text-white/60 mb-10">Investasi terbaik untuk kebutuhan Anda hari ini.</p>
                  <button className="w-full py-5 rounded-2xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-transform active:scale-95 shadow-xl shadow-white/10">
                    Dapatkan Sekarang
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="text-center py-20 md:py-32">
            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight text-white">{content.cta || 'Siap untuk memulai?'}</h2>
            <button className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg md:text-xl shadow-2xl shadow-violet-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group">
              Ambil Penawaran Terbatas Ini
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </section>

        </main>
      </div>
    </div>
  );
}
