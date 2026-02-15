
import React, { useState, useEffect, useRef } from 'react';
import MapEngine from './MapEngine';
import Sidebar from './Sidebar';
import RiskMeter from './RiskMeter';
import AiAssistant from './AiAssistant';
import WeatherWidget from './WeatherWidget';
import SimulationEngine from './SimulationEngine';
import PlaybackControlHub from './PlaybackControlHub';
import { useStore } from '../store';
import { Hand, Navigation, Search, Undo2, Eye, EyeOff, LayoutGrid, Ghost, Wind, Loader2, Cpu } from 'lucide-react';

const MissionControl: React.FC = () => {
  const { 
    uiVisible, 
    uiElements, 
    mapMode, 
    setMapMode, 
    flightPath, 
    removeLastPoint,
    isSimulating,
    isInteracting,
    toggleZenMode,
    toggleUiElement,
    setMapCenter
  } = useStore();

  const [ghostMode, setGhostMode] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showModularToggles, setShowModularToggles] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        removeLastPoint();
        triggerGhost('UNDO');
      } else if (e.key.toLowerCase() === 'd') {
        setMapMode('DRAW');
      } else if (e.key.toLowerCase() === 'h') {
        setMapMode('PAN');
      } else if (e.key.toLowerCase() === 's') {
        setMapMode('SEARCH');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [removeLastPoint, setMapMode]);

  const triggerGhost = (mode: string) => {
    setGhostMode(mode);
    setTimeout(() => setGhostMode(null), 600);
  };

  useEffect(() => {
    if (mapMode) triggerGhost(mapMode);
  }, [mapMode]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setMapMode('PAN'); 
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      <div className="absolute inset-0 z-0">
        <MapEngine />
      </div>

      {(mapMode === 'DRAW' || mapMode === 'SEARCH') && !isSimulating && (
        <div className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center opacity-70">
          <div className="relative w-12 h-12 flex items-center justify-center">
             <div className="absolute inset-0 border border-aviation-orange/30 rounded-full scale-125 animate-pulse"></div>
             <div className="w-1.5 h-1.5 bg-aviation-orange rounded-full"></div>
             <div className="absolute top-0 w-[2px] h-4 bg-aviation-orange/50"></div>
             <div className="absolute bottom-0 w-[2px] h-4 bg-aviation-orange/50"></div>
             <div className="absolute left-0 w-4 h-[2px] bg-aviation-orange/50"></div>
             <div className="absolute right-0 w-4 h-[2px] bg-aviation-orange/50"></div>
          </div>
        </div>
      )}

      {isInteracting && !isSimulating && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-900/90 border border-aviation-orange/30 px-5 py-2 rounded-full flex items-center gap-3 shadow-xl backdrop-blur-md">
             <Cpu size={14} className="text-aviation-orange animate-spin-slow" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-aviation-orange">Busy...</span>
          </div>
        </div>
      )}

      {ghostMode && (
        <div className="absolute inset-0 z-[5000] flex items-center justify-center pointer-events-none">
          <div className="animate-ghost-flash flex flex-col items-center gap-4 text-white">
            <span className="text-6xl font-black italic uppercase text-aviation-orange/60">{ghostMode}</span>
          </div>
        </div>
      )}

      <SimulationEngine />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-4 w-full max-w-lg px-6">
        {mapMode === 'SEARCH' && (
          <div className="w-full animate-in slide-in-from-bottom-4 duration-300">
             <div className="relative w-full">
                <input 
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Find a location..."
                  className="w-full h-14 bg-slate-900/90 backdrop-blur-md border border-aviation-orange rounded-2xl px-6 pr-16 text-sm text-white focus:outline-none shadow-2xl"
                />
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all"
                >
                  {isSearching ? <Loader2 size={18} className="text-aviation-orange animate-spin" /> : <Search size={18} className="text-slate-400" />}
                </button>
             </div>
          </div>
        )}

        <div className="flex items-center bg-slate-900/95 border border-slate-800/60 p-1.5 rounded-2xl shadow-2xl gap-1 backdrop-blur-xl">
          <div className="flex px-2 gap-1">
            <button onClick={() => setMapMode('PAN')} title="Pan (H)" className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${mapMode === 'PAN' ? 'bg-aviation-orange text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Hand size={20} /></button>
            <button onClick={() => setMapMode('DRAW')} title="Draw (D)" className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${mapMode === 'DRAW' ? 'bg-aviation-orange text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`} disabled={isSimulating}><Navigation size={18} className="rotate-[30deg]" /></button>
            <button onClick={() => setMapMode('SEARCH')} title="Search (S)" className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${mapMode === 'SEARCH' ? 'bg-aviation-orange text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Search size={18} /></button>
          </div>
          {flightPath.length > 0 && !isSimulating && (
            <div className="flex items-center">
              <div className="w-[1px] h-6 bg-slate-800 mx-1"></div>
              <button onClick={removeLastPoint} title="Undo (Ctrl+Z)" className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 transition-all"><Undo2 size={18} /></button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-[2000] flex flex-col items-end gap-3">
         {uiElements.aiAssistant && <AiAssistant />}
         <div className="flex flex-col gap-2 items-end">
            {showModularToggles && (
               <div className="flex gap-2 p-2 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md animate-in slide-in-from-right-4 duration-300 shadow-2xl mb-1">
                  <button 
                    onClick={() => toggleUiElement('sidebar')}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${uiElements.sidebar ? 'bg-aviation-orange text-white' : 'text-slate-500 hover:text-white'}`}
                    title="Menu"
                  ><LayoutGrid size={18} /></button>
                  <button 
                    onClick={() => toggleUiElement('weatherWidget')}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${uiElements.weatherWidget ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                    title="Weather"
                  ><Wind size={18} /></button>
                  <button 
                    onClick={() => toggleUiElement('aiAssistant')}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${uiElements.aiAssistant ? 'bg-aviation-orange text-white' : 'text-slate-500 hover:text-white'}`}
                    title="Helper"
                  ><Ghost size={18} /></button>
               </div>
            )}
            
            <div className="flex gap-2">
               <button 
                  onClick={() => setShowModularToggles(!showModularToggles)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-900/90 border border-slate-700 text-slate-400 hover:text-white shadow-xl transition-all backdrop-blur-md ${showModularToggles ? 'border-aviation-orange text-aviation-orange' : ''}`}
               ><LayoutGrid size={22} /></button>
               
               <button 
                  onClick={toggleZenMode}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border backdrop-blur-md transition-all ${uiElements.isZenMode ? 'bg-aviation-orange border-aviation-orange text-white' : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'}`}
               >{uiElements.isZenMode ? <Eye size={22} /> : <EyeOff size={22} />}</button>
            </div>
         </div>
      </div>

      <div className={`transition-opacity duration-500 ${uiVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {uiElements.sidebar && <Sidebar />}
        {uiElements.riskMeter && (
          <>
            <RiskMeter />
            {isSimulating && <PlaybackControlHub />}
          </>
        )}
        {uiElements.weatherWidget && <WeatherWidget />}
      </div>
    </div>
  );
};

export default MissionControl;
