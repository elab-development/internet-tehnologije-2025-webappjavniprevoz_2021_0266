'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          sifra: formData.password
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Podaci sa servera:", data);

        const isAdmin = data.user?.admin === true || data.user?.admin === 1 || data.admin === true;

        if (isAdmin) {
          router.push('/admin');
        } else {
          router.push('/glavna');
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Pogrešan email ili lozinka');
      }
    } catch (err) {
      setError('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-500 p-4 font-sans text-gray-900">
      <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Prijava</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Unesite email za pristup nalogu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              Email adresa
            </label>
            <input 
              required
              type="email" 
              placeholder="ime@primer.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-indigo-700 font-medium"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              Lozinka
            </label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-indigo-700 font-medium"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm font-bold">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 disabled:bg-gray-400"
          >
            {loading ? 'Provera...' : 'Prijavi se'}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <Link href="/glavna" className="block text-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors italic">
            Nastavi kao gost
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase">ILI</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>
          
          <Link href="/register" className="block text-center border-2 border-emerald-500 text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-all">
            Registruj se
          </Link>
        </div>
      </div>
    </main>
  );
}