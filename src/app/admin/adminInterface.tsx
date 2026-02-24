'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function AdminInterface() {
  const [tab, setTab] = useState<'dashboard' | 'linije' | 'stajalista' | 'tipPrevoza' | 'korisnik'>('dashboard');
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [tipoviPrevoza, setTipoviPrevoza] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

 
  const [editingStajalisteId, setEditingStajalisteId] = useState<number | null>(null);
  const [editingLinijaId, setEditingLinijaId] = useState<number | null>(null);

  const [noviNazivTipa, setNoviNazivTipa] = useState('');
  const [novoStajaliste, setNovoStajaliste] = useState({ naziv: '', brojStajalista: '', latitude: '', longitude: '' });
  const [novaLinija, setNovaLinija] = useState({
    brojLinije: '', naziv: '', pocetnaStanica: '', krajnjaStanica: '', idTipVozila: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (tab === 'dashboard') {
        const res = await fetch('/api/admin/stats');
        const result = await res.json();
        setStats(result);
        setTimeout(() => drawCharts(result), 200);
      } else {
        let url = `/api/${tab}`;
        if (tab === 'korisnik') url = '/api/admin/korisnici';
        const res = await fetch(url);
        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      }

      const resTipovi = await fetch('/api/tipPrevoza');
      const podaciTipovi = await resTipovi.json();
      setTipoviPrevoza(Array.isArray(podaciTipovi) ? podaciTipovi : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

 
  const handleLinijaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingLinijaId !== null;
    const url = isEdit ? `/api/linije/${editingLinijaId}` : '/api/linije';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...novaLinija, idTipVozila: Number(novaLinija.idTipVozila) }),
    });

    if (res.ok) {
      setNovaLinija({ brojLinije: '', naziv: '', pocetnaStanica: '', krajnjaStanica: '', idTipVozila: '' });
      setEditingLinijaId(null);
      fetchData();
    } else {
      const err = await res.json();
      setErrorMsg(err.error || "Greška pri čuvanju linije");
    }
  };

  const obrisiLiniju = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovu liniju?")) return;
    const res = await fetch(`/api/linije/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
    else setErrorMsg("Greška pri brisanju linije.");
  };

  const pokreniEditLinije = (l: any) => {

    const tipId = l.idTipaVozila || l.idTipVozila || ""; 

    setEditingLinijaId(l.idLinije);
    setNovaLinija({
      brojLinije: l.brojLinije || "",
      naziv: l.naziv || "",
      pocetnaStanica: l.pocetnaStanica || "",
      krajnjaStanica: l.krajnjaStanica || "",
      idTipVozila: tipId.toString() 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStajalisteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingStajalisteId ? `/api/stajalista/${editingStajalisteId}` : '/api/stajalista';
    const method = editingStajalisteId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoStajaliste),
    });
    if (res.ok) {
      setNovoStajaliste({ naziv: '', brojStajalista: '', latitude: '', longitude: '' });
      setEditingStajalisteId(null);
      fetchData();
    }
  };

  const obrisiStajaliste = async (id: number) => {
    if (!confirm("Da li ste sigurni?")) return;
    const res = await fetch(`/api/stajalista/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
    else setErrorMsg("Greška! Stajalište je verovatno deo neke rute.");
  };

  
  const drawCharts = (statsData: any) => {
    if (typeof window !== 'undefined' && (window as any).google && statsData) {
      const google = (window as any).google;
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(() => {
        const pieElem = document.getElementById('pie_chart');
        const barElem = document.getElementById('bar_chart');
        if (!pieElem || !barElem) return;

        const d1 = [['Tip', 'Broj']];
        (statsData.linijeStatistika || []).forEach((item: any) => d1.push([item.naziv, Number(item.vrednost)]));
        new google.visualization.PieChart(pieElem).draw(google.visualization.arrayToDataTable(d1), { title: 'Raspodela linija po tipu prevoza', pieHole: 0.4 });

        const d2 = [['Stajalište', 'Linije', { role: 'style' }]];
        (statsData.popularnaStajalista || []).forEach((item: any, i: number) => d2.push([item.naziv, Number(item.brojPojavljivanja), '#4f46e5']));
        new google.visualization.ColumnChart(barElem).draw(google.visualization.arrayToDataTable(d2), { title: 'Najprometnija stajališta', legend: 'none' });
      });
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Script src="https://www.gstatic.com/charts/loader.js" />
      

      <div className="flex flex-wrap gap-2">
        {['dashboard', 'linije', 'stajalista', 'tipPrevoza', 'korisnik'].map((t) => (
          <button key={t} onClick={() => { setTab(t as any); setEditingLinijaId(null); setEditingStajalisteId(null); }} 
            className={`px-6 py-3 rounded-2xl font-bold ${tab === t ? 'bg-white text-indigo-700' : 'bg-indigo-800/40 text-white'}`}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white/95 p-8 rounded-3xl shadow-2xl text-gray-800 min-h-[500px]">
        {errorMsg && <div className="mb-4 bg-red-100 p-4 rounded-xl text-red-700 font-bold">{errorMsg}</div>}

  
        {tab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg"><p className="text-xs font-bold opacity-80">KORISNICI</p><h3 className="text-3xl font-black">{stats.korisnici}</h3></div>
            <div className="bg-blue-500 p-6 rounded-2xl text-white shadow-lg"><p className="text-xs font-bold opacity-80">LINIJE</p><h3 className="text-3xl font-black">{stats.ukupnoLinija}</h3></div>
            <div className="bg-violet-500 p-6 rounded-2xl text-white shadow-lg"><p className="text-xs font-bold opacity-80">STAJALIŠTA</p><h3 className="text-3xl font-black">{stats.stajalista}</h3></div>
            <div className="bg-indigo-800 p-6 rounded-2xl text-white shadow-lg"><p className="text-xs font-bold opacity-80">OMILJENE</p><h3 className="text-3xl font-black">{stats.omiljene}</h3></div>
            <div id="pie_chart" className="col-span-2 h-[300px]"></div>
            <div id="bar_chart" className="col-span-2 h-[300px]"></div>
          </div>
        )}

     
        {tab === 'linije' && (
          <div className="mb-8 p-6 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200">
            <h3 className="font-black mb-4 text-blue-900">{editingLinijaId ? 'IZMENI LINIJU' : 'DODAJ LINIJU'}</h3>
            <form onSubmit={handleLinijaSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <input type="text" placeholder="Br. Linije" className="p-3 rounded-xl border" value={novaLinija.brojLinije} onChange={(e) => setNovaLinija({...novaLinija, brojLinije: e.target.value})} required />
              <input type="text" placeholder="Naziv" className="p-3 rounded-xl border" value={novaLinija.naziv} onChange={(e) => setNovaLinija({...novaLinija, naziv: e.target.value})} required />
              <input type="text" placeholder="Od" className="p-3 rounded-xl border" value={novaLinija.pocetnaStanica} onChange={(e) => setNovaLinija({...novaLinija, pocetnaStanica: e.target.value})} required />
              <input type="text" placeholder="Do" className="p-3 rounded-xl border" value={novaLinija.krajnjaStanica} onChange={(e) => setNovaLinija({...novaLinija, krajnjaStanica: e.target.value})} required />
              <select className="p-3 rounded-xl border" value={novaLinija.idTipVozila} onChange={(e) => setNovaLinija({...novaLinija, idTipVozila: e.target.value})} required>
                <option value="">Tip...</option>
                {tipoviPrevoza.map(t => <option key={t.idTipaVozila} value={t.idTipaVozila}>{t.nazivTipaVozila}</option>)}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs">{editingLinijaId ? 'Sačuvaj' : 'Dodaj'}</button>
                {editingLinijaId && <button type="button" onClick={() => {setEditingLinijaId(null); setNovaLinija({brojLinije:'', naziv:'', pocetnaStanica:'', krajnjaStanica:'', idTipVozila:''})}} className="bg-gray-400 text-white px-3 rounded-xl">✕</button>}
              </div>
            </form>
          </div>
        )}

      
        {tab === 'stajalista' && (
          <div className="mb-8 p-6 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200">
             <h3 className="font-black mb-4 text-indigo-900">{editingStajalisteId ? 'IZMENI STAJALIŠTE' : 'DODAJ STAJALIŠTE'}</h3>
             <form onSubmit={handleStajalisteSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
               <input type="text" placeholder="Naziv" className="p-3 rounded-xl border" value={novoStajaliste.naziv} onChange={(e) => setNovoStajaliste({...novoStajaliste, naziv: e.target.value})} required />
               <input type="number" placeholder="Broj" className="p-3 rounded-xl border" value={novoStajaliste.brojStajalista} onChange={(e) => setNovoStajaliste({...novoStajaliste, brojStajalista: e.target.value})} required />
               <input type="text" placeholder="Lat" className="p-3 rounded-xl border" value={novoStajaliste.latitude} onChange={(e) => setNovoStajaliste({...novoStajaliste, latitude: e.target.value})} required />
               <input type="text" placeholder="Long" className="p-3 rounded-xl border" value={novoStajaliste.longitude} onChange={(e) => setNovoStajaliste({...novoStajaliste, longitude: e.target.value})} required />
               <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs">{editingStajalisteId ? 'Sačuvaj' : 'Dodaj'}</button>
                {editingStajalisteId && <button type="button" onClick={() => {setEditingStajalisteId(null); setNovoStajaliste({naziv:'', brojStajalista:'', latitude:'', longitude:''})}} className="bg-gray-400 text-white px-3 rounded-xl">✕</button>}
               </div>
             </form>
          </div>
        )}

        
        {tab !== 'dashboard' && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 text-indigo-800 uppercase text-xs font-black">
                {tab === 'linije' && <><th className="p-4">Br.</th><th className="p-4">Naziv</th><th className="p-4">Relacija</th><th className="p-4">Akcije</th></>}
                {tab === 'stajalista' && <><th className="p-4">Naziv</th><th className="p-4">Broj</th><th className="p-4">Akcije</th></>}
                {tab === 'tipPrevoza' && <><th className="p-4">ID</th><th className="p-4">Naziv</th></>}
                {tab === 'korisnik' && <><th className="p-4">Email</th><th className="p-4">Admin</th></>}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  {tab === 'linije' && (
                    <>
                      <td className="p-4 font-black text-indigo-600">{item.brojLinije}</td>
                      <td className="p-4 font-bold">{item.naziv}</td>
                      <td className="p-4 text-xs text-gray-500">{item.pocetnaStanica} - {item.krajnjaStanica}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => pokreniEditLinije(item)} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-black">IZMENI</button>
                        <button onClick={() => obrisiLiniju(item.idLinije)} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-black">OBRIŠI</button>
                      </td>
                    </>
                  )}
                  {tab === 'stajalista' && (
                    <>
                      <td className="p-4 font-bold">{item.naziv}</td>
                      <td className="p-4 font-mono">{item.brojStajalista}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => {setEditingStajalisteId(item.idStajalista); setNovoStajaliste({naziv:item.naziv, brojStajalista:item.brojStajalista.toString(), latitude:item.latitude.toString(), longitude:item.longitude.toString()})}} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-black">IZMENI</button>
                        <button onClick={() => obrisiStajaliste(item.idStajalista)} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-black">OBRIŠI</button>
                      </td>
                    </>
                  )}
                  {tab === 'tipPrevoza' && <><td className="p-4 font-mono">#{item.idTipaVozila}</td><td className="p-4 font-black text-indigo-700">{item.nazivTipaVozila}</td></>}
                  {tab === 'korisnik' && <><td className="p-4 font-semibold">{item.email}</td><td className="p-4 font-bold text-xs">{item.admin ? 'DA' : 'NE'}</td></>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}