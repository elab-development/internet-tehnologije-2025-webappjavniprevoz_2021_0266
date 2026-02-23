'use client';

import { useState, useEffect } from 'react';

export default function AdminInterface() {
  const [tab, setTab] = useState<'linije' | 'stajalista' | 'tipPrevoza' | 'korisnik'>('linije');
  const [data, setData] = useState<any[]>([]);
  const [tipoviPrevoza, setTipoviPrevoza] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

 
  const [noviNazivTipa, setNoviNazivTipa] = useState('');
  const [novoStajaliste, setNovoStajaliste] = useState({ naziv: '', brojStajalista: '', latitude: '', longitude: '' });
  const [novaLinija, setNovaLinija] = useState({
    brojLinije: '',
    naziv: '',
    pocetnaStanica: '',
    krajnjaStanica: '',
    idTipVozila: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let url = `/api/${tab}`;
      if (tab === 'korisnik') {
        url = '/api/admin/korisnici';
      }

      const res = await fetch(url);
      const result = await res.json();
      
      if (res.ok) {
        setData(Array.isArray(result) ? result : []);
      } else {
        setErrorMsg(result.error || "Greška pri učitavanju");
        setData([]);
      }

      if (tab === 'linije') {
        const resTipovi = await fetch('/api/tipPrevoza');
        const podaciTipovi = await resTipovi.json();
        setTipoviPrevoza(Array.isArray(podaciTipovi) ? podaciTipovi : []);
      }
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);



  const handleDodajTip = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tipPrevoza', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nazivTipaVozila: noviNazivTipa }),
    });
    if (res.ok) { setNoviNazivTipa(''); fetchData(); }
  };

  const handleDodajStajaliste = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.find(s => String(s.brojStajalista) === String(novoStajaliste.brojStajalista))) {
      setErrorMsg(`Greška: Broj stajališta ${novoStajaliste.brojStajalista} već postoji!`);
      return;
    }
    const res = await fetch('/api/stajalista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...novoStajaliste,
        brojStajalista: Number(novoStajaliste.brojStajalista),
        latitude: parseFloat(novoStajaliste.latitude),
        longitude: parseFloat(novoStajaliste.longitude)
      }),
    });
    if (res.ok) { setNovoStajaliste({ naziv: '', brojStajalista: '', latitude: '', longitude: '' }); fetchData(); }
  };

  const handleDodajLiniju = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.find(l => String(l.brojLinije) === String(novaLinija.brojLinije))) {
      setErrorMsg(`Greška: Linija ${novaLinija.brojLinije} već postoji!`);
      return;
    }
    const res = await fetch('/api/linije', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...novaLinija, idTipVozila: Number(novaLinija.idTipVozila) }),
    });
    if (res.ok) { setNovaLinija({ brojLinije: '', naziv: '', pocetnaStanica: '', krajnjaStanica: '', idTipVozila: '' }); fetchData(); }
  };

  return (
    <div className="space-y-6 pb-10">

      <div className="flex flex-wrap gap-2">
        {['linije', 'stajalista', 'tipPrevoza', 'korisnik'].map((t) => (
          <button key={t} onClick={() => setTab(t as any)} 
            className={`px-6 py-3 rounded-2xl font-bold shadow-md transition-all ${tab === t ? 'bg-white text-indigo-700' : 'bg-indigo-800/40 text-white hover:bg-indigo-800/60'}`}>
            {t === 'tipPrevoza' ? 'TIP PREVOZA' : t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-gray-800 min-h-[500px]">
        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 font-bold flex justify-between items-center">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')}>✕</button>
          </div>
        )}


        {tab === 'linije' && (
          <form onSubmit={handleDodajLiniju} className="mb-10 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <input type="text" placeholder="Br. Linije" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={novaLinija.brojLinije} onChange={(e) => setNovaLinija({...novaLinija, brojLinije: e.target.value})} required />
            <input type="text" placeholder="Naziv" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={novaLinija.naziv} onChange={(e) => setNovaLinija({...novaLinija, naziv: e.target.value})} required />
            <input type="text" placeholder="Od" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={novaLinija.pocetnaStanica} onChange={(e) => setNovaLinija({...novaLinija, pocetnaStanica: e.target.value})} required />
            <input type="text" placeholder="Do" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={novaLinija.krajnjaStanica} onChange={(e) => setNovaLinija({...novaLinija, krajnjaStanica: e.target.value})} required />
            <select className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={novaLinija.idTipVozila} onChange={(e) => setNovaLinija({...novaLinija, idTipVozila: e.target.value})} required>
              <option value="">Tip vozila...</option>
              {tipoviPrevoza.map(t => <option key={t.idTipaVozila} value={t.idTipaVozila}>{t.nazivTipaVozila}</option>)}
            </select>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition-colors">DODAJ</button>
          </form>
        )}

        {tab === 'stajalista' && (
          <form onSubmit={handleDodajStajaliste} className="mb-10 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 grid grid-cols-1 md:grid-cols-5 gap-3">
            <input type="text" placeholder="Naziv" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={novoStajaliste.naziv} onChange={(e) => setNovoStajaliste({...novoStajaliste, naziv: e.target.value})} required />
            <input type="number" placeholder="Broj" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={novoStajaliste.brojStajalista} onChange={(e) => setNovoStajaliste({...novoStajaliste, brojStajalista: e.target.value})} required />
            <input type="text" placeholder="Lat" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={novoStajaliste.latitude} onChange={(e) => setNovoStajaliste({...novoStajaliste, latitude: e.target.value})} required />
            <input type="text" placeholder="Long" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={novoStajaliste.longitude} onChange={(e) => setNovoStajaliste({...novoStajaliste, longitude: e.target.value})} required />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition-colors">DODAJ</button>
          </form>
        )}

   
        {tab === 'tipPrevoza' && (
          <form onSubmit={handleDodajTip} className="mb-10 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-4">
            <input type="text" placeholder="Naziv tipa..." className="flex-1 p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" value={noviNazivTipa} onChange={(e) => setNoviNazivTipa(e.target.value)} required />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 rounded-xl font-black transition-colors">DODAJ</button>
          </form>
        )}

   
        {loading ? (
          <div className="text-center p-20 text-indigo-600 font-bold animate-pulse italic">Učitavanje...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-100 text-indigo-800 uppercase text-xs tracking-widest font-black">
                  {tab === 'linije' && <><th className="p-4">Br.</th><th className="p-4">Relacija</th><th className="p-4">Tip (ID)</th></>}
                  {tab === 'stajalista' && <><th className="p-4">Naziv</th><th className="p-4">Broj</th><th className="p-4 text-right">Koordinate</th></>}
                  {tab === 'tipPrevoza' && <><th className="p-4">ID</th><th className="p-4">Naziv</th></>}
                  {tab === 'korisnik' && <><th className="p-4">Email</th><th className="p-4">Username</th><th className="p-4">Admin</th></>}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-indigo-50/50 transition-colors">
                    {tab === 'linije' && (
                      <>
                        <td className="p-4 font-black text-indigo-600 text-2xl">{item.brojLinije}</td>
                        <td className="p-4 font-bold text-gray-800">{item.naziv} <br/><span className="text-[10px] text-gray-400 font-normal">{item.pocetnaStanica} - {item.krajnjaStanica}</span></td>
                        <td className="p-4 text-xs">ID: {item.idTipaVozila}</td>
                      </>
                    )}
                    {tab === 'stajalista' && (
                      <>
                        <td className="p-4 font-bold">{item.naziv}</td>
                        <td className="p-4 font-mono text-indigo-500 font-black">{item.brojStajalista}</td>
                        <td className="p-4 text-right text-[10px] text-gray-400 italic">{item.latitude}, {item.longitude}</td>
                      </>
                    )}
                    {tab === 'tipPrevoza' && (
                      <>
                        <td className="p-4 font-mono text-sm text-gray-400">#{item.idTipaVozila}</td>
                        <td className="p-4 font-black text-indigo-700 uppercase">{item.nazivTipaVozila}</td>
                      </>
                    )}
                    {tab === 'korisnik' && (
                      <>
                        <td className="p-4 font-semibold text-gray-900">{item.email}</td>
                        <td className="p-4 text-gray-500 italic">@{item.korisnickoIme}</td>
                        <td className="p-4">{item.admin ? 'DA' : 'NE'}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}