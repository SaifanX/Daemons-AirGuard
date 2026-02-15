
import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Plane, Trash2, AlertOctagon, Settings, Save, 
  History, X, ChevronRight, Play, Square, 
  Target, Zap, Wind, CloudLightning, ShieldCheck
} from 'lucide-react';
import { SimScenario } from '../types';

const Sidebar: React.FC = () => {
  const { 
    droneSettings, 
    updateSettings, 
    clearPath, 
    flightPath, 
    savedMissions,
    saveMission,
    loadMission,
    deleteMission,
    toggleUiElement,
    isSimulating,
    startSimulation,
    stopSimulation,
    simSpeedMultiplier,
    setSimSpeedMultiplier,
    applyScenario,
    simFollowMode,
    toggleFollowMode
  } = useStore();

  const [missionName, setMissionName] = useState('');
  const [showHangar, setShowHangar] = useState(false);

  const handleSave = () => {
    if (flightPath.length === 0) return;
    saveMission(missionName);
    setMissionName('');
  };

  return (
    <div className="absolute top-4 left-4 bottom-4 w-80 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl flex flex-col z-[1000] text-slate-200">
      <div className="p-6 border-b border-slate-700 bg-slate-800/50 rounded-t-xl flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Plane className="text-aviation-orange" size={24} />
            <h1 className="text-xl font-bold tracking-tight uppercase">AirGuard</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Tactical Command</p>
        </div>
        <button 
          onClick={() => toggleUiElement('settings')}
          className="p-2 bg-slate-800 hover:bg-aviation-orange/20 rounded-lg text-slate-400 hover:text-aviation-orange transition-all border border-slate-700"
          title="Systems Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Simulation Control Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Play size={14} className="text-emerald-400" /> Simulation Hub
          </h3>
          
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-4">
            <div className="flex flex-col gap-3">
              {!isSimulating ? (
                <button 
                  onClick={startSimulation}
                  disabled={flightPath.length < 2}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg text-xs font-bold text-emerald-400 transition-all disabled:opacity-20"
                >
                  <Play size={16} fill="currentColor" /> START MISSION SIM
                </button>
              ) : (
                <button 
                  onClick={stopSimulation}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-xs font-bold text-red-400 transition-all"
                >
                  <Square size={16} fill="currentColor" /> ABORT SIMULATION
                </button>
              )}
              
              {isSimulating && (
                <button 
                  onClick={toggleFollowMode}
                  className={`w-full flex items-center justify-center gap-2 py-2 border rounded-lg text-[10px] font-bold transition-all ${
                    simFollowMode 
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Target size={14} /> CAMERA FOLLOW: {simFollowMode ? 'ON' : 'OFF'}
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Sim Velocity Multiplier</label>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 5, 10].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => setSimSpeedMultiplier(speed)}
                    className={`py-1 text-[10px] font-mono rounded border transition-all ${
                      simSpeedMultiplier === speed 
                        ? 'bg-aviation-orange border-aviation-orange text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Environment Scenarios</label>
              <div className="grid grid-cols-1 gap-1.5">
                <button 
                  onClick={() => applyScenario('STANDARD')}
                  className="flex items-center gap-3 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-[10px] text-slate-300 transition-all group"
                >
                  <ShieldCheck size={14} className="text-emerald-400" /> 
                  <span className="flex-1 text-left">Standard Patrol (Clear)</span>
                </button>
                <button 
                  onClick={() => applyScenario('HEAVY_WEATHER')}
                  className="flex items-center gap-3 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-[10px] text-slate-300 transition-all group"
                >
                  <CloudLightning size={14} className="text-red-400" /> 
                  <span className="flex-1 text-left">Gale Force Response</span>
                </button>
                <button 
                  onClick={() => applyScenario('HIGH_ALTITUDE')}
                  className="flex items-center gap-3 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-[10px] text-slate-300 transition-all group"
                >
                  <Zap size={14} className="text-yellow-400" /> 
                  <span className="flex-1 text-left">High Altitude Recon</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Persistence Section */}
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <History size={14} /> Mission Hangar
            </h3>
            <button 
              onClick={() => setShowHangar(!showHangar)}
              className="text-[9px] font-bold text-aviation-orange hover:underline uppercase"
            >
              {showHangar ? 'New Plan' : `Recall (${savedMissions.length})`}
            </button>
          </div>

          {!showHangar ? (
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Mission Code Name..."
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-aviation-orange outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleSave}
                  disabled={flightPath.length === 0}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-aviation-orange/10 hover:bg-aviation-orange/20 border border-aviation-orange/30 rounded-lg text-xs font-bold text-aviation-orange transition-all disabled:opacity-30"
                >
                  <Save size={14} /> Store Data
                </button>
                <button 
                  onClick={clearPath} 
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/30 rounded-lg text-xs font-bold text-slate-400 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} /> Wipe Vectors
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              {savedMissions.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-600 font-mono italic">STORAGE_EMPTY</p>
                </div>
              ) : (
                savedMissions.map(m => (
                  <div key={m.id} className="group relative bg-slate-950/50 border border-slate-800 rounded-lg p-3 hover:border-slate-600 transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[11px] font-bold text-slate-200 truncate pr-6">{m.name}</span>
                      <button 
                        onClick={() => deleteMission(m.id)}
                        className="text-slate-600 hover:text-red-400 p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                      <span>{m.path.length} WPTS</span>
                      <button 
                        onClick={() => {
                          loadMission(m.id);
                          setShowHangar(false);
                        }}
                        className="text-aviation-orange hover:text-white flex items-center gap-1 font-bold"
                      >
                        RECALL <ChevronRight size={10} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        <section className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Settings size={14} /> Airframe Config
          </h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">Drone Type</label>
            <select 
              value={droneSettings.model} 
              onChange={(e) => updateSettings({ model: e.target.value as any })} 
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-aviation-orange outline-none transition-all"
            >
              <option value="Nano (<250g)">Nano (&lt;250g)</option>
              <option value="Micro (>2kg)">Micro (&gt;2kg)</option>
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label className="text-slate-400">Ceiling Limit</label>
              <span className="font-mono text-aviation-orange">{droneSettings.altitude}m</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="400" 
              value={droneSettings.altitude} 
              onChange={(e) => updateSettings({ altitude: Number(e.target.value) })} 
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-aviation-orange" 
            />
            {droneSettings.altitude > 120 && (
              <p className="text-[10px] text-red-400 font-mono flex items-center gap-1 animate-pulse">
                <AlertOctagon size={12} /> Rule 33 Violation (>120m)
              </p>
            )}
          </div>
        </section>

        <div className="mt-auto p-4 bg-slate-950/50 rounded-lg border border-slate-800">
          <p className="text-[9px] text-slate-500 font-mono leading-relaxed uppercase">
            Simulation Logic v2.8 // Time-warping enabled. Scenario parameters calibrated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
