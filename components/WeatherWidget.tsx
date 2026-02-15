
import React, { useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { CloudRain, Wind, Thermometer, Eye, RefreshCw, AlertTriangle, ShieldAlert, Clock, ArrowRightLeft, Activity } from 'lucide-react';

const WeatherWidget: React.FC = () => {
  const { weather, refreshWeather } = useStore();

  useEffect(() => {
    const interval = setInterval(refreshWeather, 300000);
    return () => clearInterval(interval);
  }, [refreshWeather]);

  return (
    <div className="absolute top-6 right-6 z-[1000] w-64">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden p-4">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Weather Station</span>
          <button onClick={refreshWeather} className="text-slate-600 hover:text-white transition-all"><RefreshCw size={12} /></button>
        </div>

        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase">Temp</p>
            <p className="text-3xl font-black text-white">{weather.temp}°C</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-500 uppercase">{weather.condition}</p>
            <p className={`text-[8px] font-bold px-2 py-0.5 rounded border mt-1 ${weather.isFlyable ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400 border-red-500/30'}`}>
              {weather.isFlyable ? 'SAFE TO FLY' : 'TOO WINDY'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Wind size={10} className="text-blue-400" />
              <span className="text-[8px] font-bold text-slate-500 uppercase">Wind</span>
            </div>
            <p className="text-sm font-bold text-slate-200">{weather.windSpeed} km/h</p>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Eye size={10} className="text-aviation-orange" />
              <span className="text-[8px] font-bold text-slate-500 uppercase">Sight</span>
            </div>
            <p className="text-sm font-bold text-slate-200">{weather.visibility} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
