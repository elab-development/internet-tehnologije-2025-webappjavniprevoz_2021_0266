'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (formData.confirmPassword === '') {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          korisnickoIme: formData.username,
          email: formData.email,
          sifra: formData.password,
          admin: false 
        }),
      });

      if (res.ok) {
        router.push('/glavna');
      } else {
        const data = await res.json();
        setError(data.message || 'Greška pri registraciji');
      }
    } catch (err) {
      setError('Problem sa serverom. Pokušajte kasnije.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-500 p-4 font-sans">
      <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Napravi nalog</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
         
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Korisničko ime</label>
            <input 
              required type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 text-indigo-700 font-medium transition-all"
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email adresa</label>
            <input 
              required type="email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 text-indigo-700 font-medium transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Lozinka</label>
            <input 
              required type="password" 
              className={`w-full px-4 py-3 rounded-xl border outline-none text-indigo-700 transition-all ${!passwordsMatch ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'}`}
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Potvrdi lozinku</label>
            <input 
              required type="password" 
              className={`w-full px-4 py-3 rounded-xl border outline-none text-indigo-700 transition-all ${!passwordsMatch ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
            />
            {!passwordsMatch && <p className="text-red-500 text-xs mt-2 font-bold animate-pulse">⚠ Lozinke se ne poklapaju!</p>}
          </div>

          {error && <p className="text-red-600 text-center text-sm font-bold bg-red-100 p-2 rounded-lg">{error}</p>}

          <button 
            type="submit"
            disabled={!passwordsMatch || loading}
            className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 ${passwordsMatch && !loading ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {loading ? 'Slanje...' : 'Registruj se'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-indigo-600 font-bold hover:underline italic">Povratak na prijavu</Link>
        </div>
      </div>
    </main>
  );
}