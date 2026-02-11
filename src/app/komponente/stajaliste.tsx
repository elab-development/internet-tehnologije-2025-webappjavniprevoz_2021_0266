'use client';
import { Heart, Lock } from 'lucide-react';

interface StationCardProps {
  station: any;
  isLoggedIn: boolean;
  isFavorite: boolean;
  onSelect: (s: any) => void;
  onHeartClick: (e: React.MouseEvent, s: any) => void;
}

export const Stajaliste = ({ station, isLoggedIn, isFavorite, onSelect, onHeartClick }: StationCardProps) => {
  return (
    <div 
      onClick={() => onSelect({...station, lat: Number(station.latitude || station.lat), lng: Number(station.longitude || station.lng)})} 
      className="p-5 bg-white border-2 border-slate-100 rounded-3xl flex justify-between items-center cursor-pointer hover:border-indigo-200 transition-all"
    >
      <div>
        <span className="text-[11px] font-black text-indigo-600 block">#{station.brojStajalista || station.idStajalista}</span>
        <p className="font-bold text-slate-800 uppercase">{station.naziv}</p>
      </div>
      <button onClick={(e) => onHeartClick(e, station)}>
        {!isLoggedIn ? (
          <Lock size={20} className="text-slate-200 hover:text-indigo-400 transition-colors" />
        ) : (
          <Heart size={24} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-200"} />
        )}
      </button>
    </div>
  );
};