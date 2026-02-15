

import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { lineString, length } from '@turf/turf';
import { 
  Plane, Trash2, Settings as SettingsIcon, Save, 
  History, X, ChevronRight, Play, Square, 
  Target, Zap, Wind, ShieldCheck,
  Wand2, Download, ExternalLink, Battery, Radio, Gauge, FileText, Check, LayoutDashboard, ChevronLeft, FastForward, Key, Eye, EyeOff, Shield, CloudSun, Clock, Navigation2, FileJson, Map as MapIcon, Scale, AlertOctagon, Info, Trophy
} from 'lucide-react';
import { Coordinate, PreFlightChecklist as ChecklistType, SidebarTab } from '../types';
import { exportToGPX, exportToKML } from '../utils/exportUtils';

const PathThumbnail = ({ path }: { path: Coordinate[] }) => {
  if (path.length < 2) return <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Plane size={12} className="text-slate-600 opacity-20" /></div>;
  
  const lats = path.map(p => p.lat);
  const lngs = path.map(p => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  const padding = 10;
  const width = 100;
  const height = 100;
  
  const normalize = (val: number, min: number, max: number, range: number) => {
    if (max === min) return range / 2;
    return padding + ((val - min) / (max - min)) * (range - 2 * padding);
  };

  const points = path.map(p => ({
    x: normalize(p.lng, minLng, maxLng, width),
    y: height - normalize(p.lat, minLat, maxLat, height)
  }));

  const pathStr = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full bg-slate-900/50">
      <path d={pathStr} fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[0].x} cy={points[0].y} r="6" fill="#10b981" />
      <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="6" fill="#ef4444" />
    </svg>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    droneSettings, updateSettings, clearPath, flightPath, 
    savedMissions, saveMission, loadMission, deleteMission,
    isSimulating, startSimulation,
    checklist, toggleChecklistItem, 
    sidebarTab, setSidebarTab, autoCheckChecklist,
    userApiKey, setApiKey, weatherApiKey, setWeatherApiKey,
    riskLevel, autoFixPath, violations
  } = useStore();

  const [missionName, setMissionName] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  const stats = useMemo(() => {
    if (flightPath.length < 2) return { distance: 0, eta: 0 };
    // Fixed with named imports
    const line = lineString(flightPath.map(p => [p.lng, p.lat]));
    const dist = length(line, { units: 'kilometers' });
    const time = (dist / 40) * 60; 
    return { distance: dist.toFixed(2), eta: Math.ceil(time) };
  }, [flightPath]);

  const handleSave = () => {
    if (flightPath.length === 0) return;
    saveMission(missionName);
    setMissionName('');
  };

  const handleCommitSettings = () => {
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const checklistItems: { key: keyof ChecklistType; label: string; icon: React.ReactNode }[] = [
    { key: 'batteryChecked', label: 'Battery Checked', icon: <Battery size={14} /> },
    { key: 'propellersInspected', label: 'Propellers OK', icon: <Gauge size={14} /> },
    { key: 'gpsLock', label: 'GPS Signal Found', icon: <Radio size={14} /> },
    { key: 'permitChecked', label: 'Rules Checked', icon: <FileText size={14} /> },
    { key: 'softwareUpdated', label: 'Ready to Go', icon: <ShieldCheck size={14} /> },
  ];

  const allChecked = Object.values(checklist).every(v => v);

  return (
    <div className="absolute top-4 left-4 bottom-4 w-72 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col z-[1000] text-slate-200 overflow-hidden">
      <div className="p-5 pb-3 bg-slate-800/40 flex justify-between items-center">
        <div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded bg-aviation-orange flex items-center justify-center">
                <Plane className="text-white transform -rotate-45" size={16} />
            </div>
            <h1 className="text-lg font-black italic tracking-tighter uppercase">AirGuard</h1>
          </button>
          <p className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">TechnoFest 2026</p>
        </div>
        <button 
          onClick={() => setSidebarTab('SETTINGS')}
          className={`p-2 rounded-xl border transition-all ${sidebarTab === 'SETTINGS' ? 'bg-aviation-orange/20 border-aviation-orange text-aviation-orange' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
        >
          <SettingsIcon size={16} />
        </button>
      </div>

      <div className="px-4 flex border-b border-slate-800 overflow-x-auto scrollbar-hide">
        {(['SETUP', 'CHECKLIST', 'SAVED', 'SAFETY', 'SETTINGS'] as SidebarTab[]).map(tab => (
           <button
             key={tab}
             onClick={() => setSidebarTab(tab)}
             className={`flex-shrink-0 px-3 py-3 text-[9px] font-black uppercase tracking-widest transition-all border-b-2 ${sidebarTab === tab ? 'border-aviation-orange text-aviation-orange' : 'border-transparent text-slate-500'}`}
           >
             {tab === 'SAVED' ? 'Routes' : tab === 'SAFETY' ? 'Safety' : tab}
           </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {sidebarTab === 'SETUP' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <section className="space-y-4">
              <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Flight Stats</h3>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <p className="text-[7px] text-slate-500 uppercase font-black mb-1">Distance</p>
                  <span className="text-base font-mono font-bold text-white">{stats.distance} km</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <p className="text-[7px] text-slate-500 uppercase font-black mb-1">Time</p>
                  <span className="text-base font-mono font-bold text-white">{stats.eta} min</span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Drone Options</h3>
              <div className="space-y-4">
                <select 
                  value={droneSettings.model}
                  onChange={(e) => updateSettings({ model: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-aviation-orange"
                >
                  <option value="Nano (<250g)">Mini Drone</option>
                  <option value="Micro (>2kg)">Heavy Drone</option>
                </select>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-bold uppercase">
                    <label className="text-slate-400">Flight Height</label>
                    <span className="text-aviation-orange">{droneSettings.altitude}m</span>
                  </div>
                  <input 
                    type="range" min="10" max="150" step="10"
                    value={droneSettings.altitude} 
                    onChange={(e) => updateSettings({ altitude: Number(e.target.value) })} 
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-aviation-orange" 
                  />
                </div>
              </div>
            </section>

            <section className="space-y-3 pt-4">
              <button onClick={clearPath} className="w-full py-2.5 bg-slate-800 hover:bg-red-500/10 rounded-xl text-xs font-bold text-slate-500 hover:text-red-400 border border-slate-700 transition-all">Clear Route</button>
              {!isSimulating && (
                <button onClick={startSimulation} className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-widest transition-all ${allChecked && flightPath.length > 1 ? 'bg-aviation-orange text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                  {allChecked ? 'Test Flight' : 'Checklist First'}
                </button>
              )}
            </section>
          </div>
        )}

        {sidebarTab === 'SAFETY' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Safety Rules</h3>
            {violations.length === 0 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-4 flex flex-col items-center gap-2 text-center">
                <ShieldCheck size={28} className="text-emerald-400" />
                <p className="text-xs font-bold text-emerald-400">ALL GOOD!</p>
                <p className="text-[9px] text-slate-400">Your route follows all safety rules.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-bold text-red-400 uppercase">Heads Up!</p>
                  <p className="text-[8px] text-slate-400 mt-1">{violations.length} safety warnings found.</p>
                </div>
                {violations.map((v, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                    <p className="text-[9px] text-slate-400 italic">{v}</p>
                  </div>
                ))}
                <button onClick={autoFixPath} className="w-full py-3 bg-aviation-orange rounded-xl text-[10px] font-bold text-white uppercase tracking-widest">Fix for Me</button>
              </div>
            )}
          </div>
        )}

        {sidebarTab === 'CHECKLIST' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <button onClick={() => setSidebarTab('SETUP')} className="text-[8px] font-bold text-slate-500 uppercase">Back</button>
              <button onClick={autoCheckChecklist} className="text-[8px] font-bold text-aviation-orange uppercase">Easy Check</button>
            </div>
            <div className="space-y-2">
              {checklistItems.map(item => (
                <button key={item.key} onClick={() => toggleChecklistItem(item.key)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${checklist[item.key] ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  <span className="text-[11px] font-bold uppercase">{item.label}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checklist[item.key] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'}`}>{checklist[item.key] && <Check size={10} className="text-white" />}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {sidebarTab === 'SAVED' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex gap-2">
              <input type="text" placeholder="Route Name" value={missionName} onChange={(e) => setMissionName(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none" />
              <button onClick={handleSave} className="px-3 bg-aviation-orange rounded-xl text-white"><Save size={14} /></button>
            </div>
            <div className="space-y-2">
              {savedMissions.map(m => (
                <div key={m.id} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex gap-3">
                  <div className="w-10 h-10 rounded bg-slate-900 overflow-hidden"><PathThumbnail path={m.path} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="text-[11px] font-bold text-slate-200 truncate">{m.name}</span>
                      <button onClick={() => deleteMission(m.id)} className="text-slate-600"><Trash2 size={10} /></button>
                    </div>
                    <button onClick={() => loadMission(m.id)} className="text-[9px] text-aviation-orange font-bold mt-1 uppercase">Load</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sidebarTab === 'SETTINGS' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <section className="space-y-4">
              <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Configuration</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400">Gemini Key</label>
                  <input type="password" value={userApiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Key..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400">Weather Key</label>
                  <input type="password" value={weatherApiKey} onChange={(e) => setWeatherApiKey(e.target.value)} placeholder="Key..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                </div>
              </div>
            </section>
            <button onClick={handleCommitSettings} className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${saveStatus ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {saveStatus ? 'Done!' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;