'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Polyline, Marker, InfoWindow } from '@react-google-maps/api';
import { Heart, LogOut, MapPin, ChevronDown, ArrowLeft, CheckCircle2, Bus, Lock, UserCircle } from 'lucide-react';
import { Linija } from '@/app/komponente/linija';
import { Stajaliste } from '@/app/komponente/stajaliste';
import {StajalisteInfoWindow } from '@/app/komponente/StajalisteInfoWindow';

const BOJE_TIPA: Record<string, string> = {
  'Autobus': '#3b82f6',
  'Tramvaj': '#ef4444',
  'Trolejbus': '#f59e0b',
};

const DOZVOLJENE_LINIJE = ['14', '29', '67']; 

export default function GlavnaStrana() {
  const router = useRouter();
  const [view, setView] = useState<'default' | 'fav-linije' | 'fav-stanice'>('default');
  const [activeTab, setActiveTab] = useState<'linije' | 'stanice'>('linije');
  const [activeSmer, setActiveSmer] = useState<number>(0); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  const [linije, setLinije] = useState<any[]>([]);
  const [svaStajalistaIzBaze, setSvaStajalistaIzBaze] = useState<any[]>([]);
  const [selektovanaLinija, setSelektovanaLinija] = useState<any | null>(null);
  const [stajalistaLinije, setStajalistaLinije] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [linijeNaStajalistu, setLinijeNaStajalistu] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [resetKey, setResetKey] = useState(0);

  const [omiljeneLinije, setOmiljeneLinije] = useState<any[]>([]);
  const [omiljenaStajalista, setOmiljenaStajalista] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { isLoaded } = useJsApiLoader({ 
    googleMapsApiKey: "AIzaSyAKRkKGk-wgc03gU7wq54gpNP7QQuIMbEE" 
  });

  const osveziFavorite = async () => {
    try {
      const [resL, resS] = await Promise.all([
        fetch('/api/korisnik/omiljene-linije'),
        fetch('/api/korisnik/omiljena-stajalista')
      ]);
      
      if (resL.ok && resS.ok) {
        setOmiljeneLinije(await resL.json());
        setOmiljenaStajalista(await resS.json());
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) { 
      console.error(e); 
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetch('/api/linije').then(res => res.json()).then(data => setLinije(data || []));
    fetch('/api/stajalista').then(res => res.json()).then(data => setSvaStajalistaIzBaze(data || []));
    osveziFavorite();
  }, []);

  const handleLinijaHeartClick = async (e: React.MouseEvent, l: any) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setToast({ message: "Moraš se prijaviti!", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 2000);
      return;
    }

    const favoritZapis = omiljeneLinije.find(f => Number(f.idLinije) === Number(l.idLinije));
    if (favoritZapis) {
      await fetch(`/api/korisnik/omiljene-linije/${favoritZapis.idOmiljeneLinije}`, { method: 'DELETE' });
    } else {
      await fetch(`/api/korisnik/omiljene-linije`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idLinije: l.idLinije })
      });
    }
    setToast({ message: favoritZapis ? "Uklonjeno" : "Dodato", show: true });
    osveziFavorite();
    setTimeout(() => setToast({ message: '', show: false }), 2000);
  };

  const handleStajalisteHeartClick = async (e: React.MouseEvent, s: any) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setToast({ message: "Moraš se prijaviti!", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 2000);
      return;
    }

    const favoritZapis = omiljenaStajalista.find(f => Number(f.idStajalista) === Number(s.idStajalista));
    if (favoritZapis) {
      await fetch(`/api/korisnik/omiljena-stajalista/${favoritZapis.idOmiljenaStajalista}`, { method: 'DELETE' });
    } else {
      await fetch(`/api/korisnik/omiljena-stajalista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idStajalista: s.idStajalista })
      });
    }
    setToast({ message: favoritZapis ? "Uklonjeno" : "Dodato", show: true });
    osveziFavorite();
    setTimeout(() => setToast({ message: '', show: false }), 2000);
  };

  const handlePrikaziLiniju = async (l: any) => {
    if (!DOZVOLJENE_LINIJE.includes(l.brojLinije)) return;
    setSelektovanaLinija(l);
    setActiveSmer(0);
    const res = await fetch(`/api/linije/${l.idLinije}/stajalista`);
    if (res.ok) {
      const data = await res.json();
      setStajalistaLinije(data.map((s: any) => ({ ...s, lat: parseFloat(s.latitude || s.lat), lng: parseFloat(s.longitude || s.lng), smer: Number(s.smer) })));
      setResetKey(prev => prev + 1);
    }
  };

  const handleMarkerClick = async (stajaliste: any) => {
    setSelectedMarker(stajaliste);
    setLinijeNaStajalistu([]); 
    try {
      const res = await fetch(`/api/stajalista/${stajaliste.idStajalista}/linije`);
      if (res.ok) setLinijeNaStajalistu(await res.json());
    } catch (e) { console.error(e); }
  };

 

  const prikazaneLinijeFinal = useMemo(() => {
    const baza = view === 'fav-linije' ? linije.filter(l => omiljeneLinije.some(f => Number(f.idLinije) === Number(l.idLinije))) : linije;
    return baza.filter(l => l.brojLinije.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [linije, omiljeneLinije, view, searchQuery]);

  const prikazanaStajalistaFinal = useMemo(() => {
    const baza = view === 'fav-stanice' ? svaStajalistaIzBaze.filter(s => omiljenaStajalista.some(f => Number(f.idStajalista) === Number(s.idStajalista))) : svaStajalistaIzBaze;
    return baza.filter(s => s.naziv?.toLowerCase().includes(searchQuery.toLowerCase()) || s.brojStajalista?.toString().includes(searchQuery)).slice(0, 50);
  }, [svaStajalistaIzBaze, omiljenaStajalista, view, searchQuery]);

  const putanjaZaMapu = useMemo(() => {
    return stajalistaLinije.filter(s => Number(s.smer) === activeSmer).map(s => ({ lat: s.lat, lng: s.lng }));
  }, [stajalistaLinije, activeSmer]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border border-slate-700">
          <CheckCircle2 size={18} className="text-emerald-400" /> {toast.message}
        </div>
      )}

      <div className="w-[420px] bg-white shadow-2xl z-20 flex flex-col border-r border-slate-200">
        <div className="p-8 bg-indigo-600 text-white">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setView('default'); setSelektovanaLinija(null); setStajalistaLinije([]); setSelectedMarker(null);}}>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">Prevezi.me</h1>
            </div>
            
            <div className="relative">
              {!isLoggedIn ? (
                <button 
                  onClick={() => router.push('/')} 
                  className="bg-indigo-700/50 hover:bg-indigo-700 px-4 py-2 rounded-xl text-[11px] font-bold border border-indigo-400/30 uppercase flex items-center gap-2 transition-all"
                >
                  Prijavi se <UserCircle size={14} />
                </button>
              ) : (
                <>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-indigo-700/50 px-4 py-2 rounded-xl text-[11px] font-bold border border-indigo-400/30 uppercase flex items-center gap-2"> 
                    Nalog <ChevronDown size={14} /> 
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-slate-700 z-50 font-bold text-[10px] uppercase">
                      <button onClick={() => { setView('fav-linije'); setIsMenuOpen(false); setActiveTab('linije'); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl flex items-center gap-2"><Heart size={14} className="text-rose-500 fill-rose-500"/> Omiljene Linije</button>
                      <button onClick={() => { setView('fav-stanice'); setIsMenuOpen(false); setActiveTab('stanice'); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl flex items-center gap-2"><MapPin size={14} className="text-indigo-500"/> Omiljene Stanice</button>
                      <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")} className="w-full text-left px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl flex items-center gap-2 border-t mt-1"><LogOut size={14}/> Odjava</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <input type="text" placeholder="Pretraži..." className="w-full bg-indigo-700/40 border border-indigo-400/30 rounded-2xl py-4 px-5 text-white placeholder-indigo-200 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="flex p-4 bg-slate-50 border-b gap-2">
          <button onClick={() => { setActiveTab('linije'); setView('default'); }} className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest ${activeTab === 'linije' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400'}`}>LINIJE</button>
          <button onClick={() => { setActiveTab('stanice'); setView('default'); }} className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest ${activeTab === 'stanice' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400'}`}>STANICE</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {activeTab === 'linije' ? (
               prikazaneLinijeFinal.map(l => (
                <Linija 
                      key={l.idLinije}
                      linija={l}
                      isSelected={selektovanaLinija?.idLinije === l.idLinije}
                      isLoggedIn={isLoggedIn}
                      isFavorite={omiljeneLinije.some(f => Number(f.idLinije) === Number(l.idLinije))}
                      onSelect={handlePrikaziLiniju}
                      onHeartClick={handleLinijaHeartClick}
                      bojaTipa={BOJE_TIPA[l.tipVozila] || '#3b82f6'}
                      isAllowed={DOZVOLJENE_LINIJE.includes(l.brojLinije)}
                />
              ))
          ) : (
            prikazanaStajalistaFinal.map(s => (
              <Stajaliste
                  key={s.idStajalista}
                  station={s}
                  isLoggedIn={isLoggedIn}
                  isFavorite={omiljenaStajalista.some(f => Number(f.idStajalista) === Number(s.idStajalista))}
                  onSelect={handleMarkerClick}
                  onHeartClick={handleStajalisteHeartClick}
                />
            ))
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        {isLoaded && (
          <GoogleMap key={resetKey} mapContainerStyle={{ width: '100%', height: '100%' }} center={selectedMarker ? { lat: selectedMarker.lat, lng: selectedMarker.lng } : { lat: 44.8125, lng: 20.4612 }} zoom={selectedMarker ? 16 : 13} options={{ disableDefaultUI: true }}>
            {putanjaZaMapu.length > 0 && (
              <>
                <Polyline path={putanjaZaMapu} options={{ strokeColor: BOJE_TIPA[selektovanaLinija?.tipVozila] || '#4338ca', strokeWeight: 6 }} />
                {stajalistaLinije.filter(s => Number(s.smer) === activeSmer).map((stop, i) => (
                  <Marker key={`s-${stop.idStajalista}-${i}`} position={{ lat: stop.lat, lng: stop.lng }} onClick={() => handleMarkerClick(stop)} icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: '#fff', fillOpacity: 1, strokeColor: '#1e293b', strokeWeight: 2 }} />
                ))}
              </>
            )}
            {selectedMarker && (
              <StajalisteInfoWindow
                selectedMarker={selectedMarker}
                linijeNaStajalistu={linijeNaStajalistu}
                onClose={() => setSelectedMarker(null)}
                bojeTipa={BOJE_TIPA}
              />
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}