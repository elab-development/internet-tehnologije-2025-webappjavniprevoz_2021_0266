'use client';
import { Heart, Lock } from 'lucide-react';

interface BusLineCardProps {
  linija: any;
  isSelected: boolean;
  isLoggedIn: boolean;
  isFavorite: boolean;
  onSelect: (l: any) => void;
  onHeartClick: (e: React.MouseEvent, l: any) => void;
  bojaTipa: string;
  isAllowed: boolean;
}

export const Linija = ({ linija, isSelected, isLoggedIn, isFavorite, onSelect, onHeartClick, bojaTipa, isAllowed }: BusLineCardProps) => {
  return (
    <div 
      onClick={() => isAllowed && onSelect(linija)} 
      className={`p-6 rounded-[2rem] border-2 transition-all ${!isAllowed ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'} ${isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'bg-white border-slate-100'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-5xl font-black text-indigo-600">{linija.brojLinije}</span>
          <span className="text-[11px] font-bold mt-3 uppercase text-slate-400">{linija.naziv}</span>
        </div>
        <div className="flex flex-col items-end gap-4">
          <span className="px-4 py-1.5 rounded-full text-[10px] font-black text-white shadow-sm" style={{ backgroundColor: bojaTipa }}>
            {linija.tipVozila}
          </span>
          <button onClick={(e) => onHeartClick(e, linija)}>
            {!isLoggedIn ? (
              <Lock size={20} className="text-slate-200 hover:text-indigo-400 transition-colors" />
            ) : (
              <Heart size={24} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-200"} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};