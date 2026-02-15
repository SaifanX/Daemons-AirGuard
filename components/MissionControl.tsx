
import React from 'react';
import MapEngine from './MapEngine';
import Sidebar from './Sidebar';
import RiskMeter from './RiskMeter';
import AiAssistant from './AiAssistant';
import WeatherWidget from './WeatherWidget';
import SettingsOverlay from './SettingsOverlay';
import SimulationEngine from './SimulationEngine';
import { useStore } from '../store';
import { Hand, Crosshair, Undo2 } from 'lucide-react';

const MissionControl: React.FC = () => {
  const { 
    uiVisible, 
    uiElements, 
    mapMode, 
    setMapMode, 
    flightPath, 
    removeLastPoint,
    isSimulating
  } = useStore();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Background Map Layer */}
      <div className="absolute inset-0 z-0">
        <MapEngine />
      </div>

      {/* Logic Layers */}
      <SettingsOverlay />
      <SimulationEngine />

      {/* Tactical HUD: Mode Selector */}
      <div className="absolute top-6 left-80 ml-6 z-[1000] flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1 rounded-lg shadow-2xl animate-in fade-in slide-in-from-left duration-500">
        <button
          onClick={() => setMapMode('PAN')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
            mapMode === 'PAN' 
              ? 'bg-aviation-orange text-white shadow-lg shadow-orange-900/40' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
          title="Pan Map (Navigation Mode)"
        >
          <Hand size={14} />
          <span className="hidden lg:inline">Pan</span>
        </button>
        
        <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
        
        <button
          onClick={() => setMapMode('DRAW')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
            mapMode === 'DRAW' 
              ? 'bg-aviation-orange text-white shadow-lg shadow-orange-900/40' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
          disabled={isSimulating}
          title="Draw Path (Vector Input Mode)"
        >
          <Crosshair size={14} />
          <span className="hidden lg:inline">Draw</span>
        </button>

        {flightPath.length > 0 && !isSimulating && (
          <>
            <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
            <button
              onClick={removeLastPoint}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
              title="Undo Last Waypoint"
            >
              <Undo2 size={14} />
              <span className="hidden lg:inline">Undo</span>
            </button>
          </>
        )}
      </div>

      {/* Control Layer (Audit-Ready) */}
      <div className={`transition-opacity duration-500 ${uiVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {uiElements.sidebar && <Sidebar />}
        {uiElements.riskMeter && <RiskMeter />}
        {uiElements.weatherWidget && <WeatherWidget />}
        {uiElements.aiAssistant && <AiAssistant />}
      </div>
      
      {/* System Status HUD */}
      <div className="absolute top-4 right-[21rem] z-[1000] hidden md:block">
        <div className="bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-md text-[10px] font-mono text-slate-400 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-emerald-400 animate-pulse' : (mapMode === 'DRAW' ? 'bg-aviation-orange animate-pulse' : 'bg-blue-400')}`}></div>
          INTEL_FEED: {isSimulating ? 'SIMULATION_ACTIVE' : (mapMode === 'DRAW' ? 'WAYPOINT_RECORDING' : 'SCANNING_ENVIRONMENT')}
        </div>
      </div>
    </div>
  );
};

export default MissionControl;
