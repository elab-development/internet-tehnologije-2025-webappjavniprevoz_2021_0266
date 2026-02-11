'use client';
import { InfoWindow } from '@react-google-maps/api';

interface StationInfoWindowProps {
  selectedMarker: any;
  linijeNaStajalistu: any[];
  onClose: () => void;
  bojeTipa: Record<string, string>;
}

export const StajalisteInfoWindow = ({ selectedMarker, linijeNaStajalistu, onClose, bojeTipa }: StationInfoWindowProps) => {
  return (
    <InfoWindow 
      position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }} 
      onCloseClick={onClose}
    >
      <div className="p-2 min-w-[170px] bg-white text-slate-900">
        <p className="font-black text-[10px] text-slate-400 uppercase mb-1">
          Stajalište #{selectedMarker.brojStajalista || selectedMarker.idStajalista}
        </p>
        <p className="font-bold text-[14px] uppercase mb-4">
          {selectedMarker.naziv || selectedMarker.stajaliste}
        </p>
        <div className="flex flex-wrap gap-2">
          {linijeNaStajalistu.map((l: any) => (
            <div 
              key={l.brojLinije} 
              className="w-10 h-10 flex items-center justify-center rounded-xl text-white text-[12px] font-black shadow-md" 
              style={{ backgroundColor: bojeTipa[l.tipVozila] || '#3b82f6' }}
            >
              {l.brojLinije}
            </div>
          ))}
        </div>
      </div>
    </InfoWindow>
  );
};