
import React, { useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { CloudRain, Wind, Thermometer, Eye, RefreshCw, AlertTriangle, ShieldAlert, Clock, ArrowRightLeft } from 'lucide-react';

const WeatherWidget: React.FC = () => {
  const { weather, refreshWeather, fixPath } = useStore();

  // Auto-refresh weather every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshWeather, 300000);
    return () => clearInterval(interval);
  }, [refreshWeather]);

  const activeAlerts = useMemo(() => {
    const alerts = [];
    if (weather.windSpeed > 25) {
      alerts.push({
        type: 'WIND',
        severity: weather.windSpeed > 35 ? 'CRITICAL' : 'WARNING',
        message: `High Wind Velocity: ${weather.windSpeed} km/h`,
        suggestion: 'MISSION DELAY RECOMMENDED',
        icon: <Wind size={16} />
      });
    }
    if (weather.visibility < 5) {
      alerts.push({
        type: 'VISIBILITY',
        severity: weather.visibility < 2 ? 'CRITICAL' : 'WARNING',
        message: `Low Visibility: ${weather.visibility} km`,
        suggestion: 'REROUTE TO LOW-ALTITUDE SECTORS',
        icon: <Eye size={16} />
      });
    }
    if (weather.condition === 'Storm') {
      alerts.push({
        type: 'CONDITION',
        severity: 'CRITICAL',
        message: 'Severe Storm Warning',
        suggestion: 'IMMEDIATE GROUNDING REQUIRED',
        icon: <ShieldAlert size={16} />
      });
    }
    return alerts;
  }, [weather]);

  return (
    <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2 w-64 md:w-72">
      {/* Proactive Weather Alerts */}
      {activeAlerts.map((alert, idx) => (
        <div 
          key={idx} 
          className={`
            border backdrop-blur-md rounded-lg shadow-xl p-3 animate-in slide-in-from-right duration-500
            ${alert.severity === 'CRITICAL' ? 'bg-red-500/90 border-red-400' : 'bg-orange-500/90 border-orange-400'}
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 bg-white/20 rounded">
                {alert.icon}
            </div>
            <span className="font-bold text-[10px] text-white uppercase tracking-wider">Tactical {alert.type} Alert</span>
          </div>
          <p className="text-xs font-bold text-white leading-tight mb-2">
            {alert.message}
          </p>
          <div className="bg-black/20 rounded p-2 border border-white/10 flex flex-col gap-1">
             <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-white/90">
                <Clock size={10} /> {alert.suggestion}
             </div>
             {alert.type === 'VISIBILITY' && (
                <button 
                    onClick={fixPath}
                    className="mt-1 text-[8px] font-bold text-white/70 hover:text-white flex items-center gap-1 transition-colors"
                >
                    <ArrowRightLeft size={8} /> REQUEST OPTIMIZED REROUTE
                </button>
             )}
          </div>
        </div>
      ))}

      {/* Main Weather HUD */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl p-4 text-slate-200 group">
        <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ActivityIcon active={weather.isFlyable} /> Local Metar Station
            </h3>
            <button onClick={refreshWeather} className="text-slate-500 hover:text-aviation-orange transition-colors">
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
        </div>

        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                    {weather.condition === 'Storm' ? <CloudRain className="text-red-500 animate-bounce" /> : <Wind className="text-blue-400" />}
                </div>
                <div>
                    <div className="text-2xl font-bold font-mono">{weather.temp}°C</div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{weather.condition}</div>
                </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
            weather.isFlyable 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
            {weather.isFlyable ? 'FLYABLE' : 'NO GO'}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50 flex flex-col gap-1">
                <span className="text-[8px] text-slate-500">WIND</span>
                <div className="flex items-center gap-1.5">
                    <Wind size={12} className={weather.windSpeed > 25 ? "text-orange-400" : "text-slate-400"} />
                    <span className={weather.windSpeed > 25 ? "text-orange-400 font-bold" : "text-slate-200"}>
                        {weather.windSpeed} KM/H {weather.windDirection}
                    </span>
                </div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50 flex flex-col gap-1">
                <span className="text-[8px] text-slate-500">VIS</span>
                <div className="flex items-center gap-1.5">
                    <Eye size={12} className={weather.visibility < 5 ? "text-orange-400" : "text-slate-400"} />
                    <span className={weather.visibility < 5 ? "text-orange-400 font-bold" : "text-slate-200"}>
                        {weather.visibility} KM
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ActivityIcon = ({ active }: { active: boolean }) => (
    <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${active ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
    </span>
);

export default WeatherWidget;
