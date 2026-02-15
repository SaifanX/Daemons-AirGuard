
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, useMapEvents, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../store';
import { RESTRICTED_ZONES } from '../data/zones';
import { ZoneType } from '../types';

// Component to dynamically toggle map handlers based on mapMode
const MapHandlerController = () => {
  const map = useMap();
  const mapMode = useStore(state => state.mapMode);
  const { isSimulating, simPosition, simFollowMode } = useStore();

  useEffect(() => {
    if (mapMode === 'PAN') {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.enable();
    }
  }, [map, mapMode]);

  // Handle Follow Mode
  useEffect(() => {
    if (isSimulating && simPosition && simFollowMode) {
      map.setView([simPosition.lat, simPosition.lng], map.getZoom(), {
        animate: true,
        duration: 0.1
      });
    }
  }, [simPosition, simFollowMode, isSimulating, map]);

  return null;
};

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timeout);
  }, [map]);
  return null;
};

const MapInteractions = () => {
  const { addPoint, mapMode, isSimulating } = useStore();
  const map = useMap();

  useMapEvents({
    click(e) {
      if (mapMode === 'DRAW' && !isSimulating) {
        addPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });

  useEffect(() => {
    const container = map.getContainer();
    if (isSimulating) {
      container.style.cursor = 'wait';
    } else if (mapMode === 'DRAW') {
      container.style.cursor = 'crosshair';
    } else if (mapMode === 'PAN') {
      container.style.cursor = 'grab';
    } else {
      container.style.cursor = 'default';
    }
  }, [mapMode, map, isSimulating]);

  return null;
};

const waypointIcon = (index: number, isSelected: boolean) => L.divIcon({
  className: 'waypoint-icon',
  html: `<div class="w-6 h-6 bg-slate-900/80 border ${isSelected ? 'border-white scale-125 bg-aviation-orange shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'border-aviation-orange'} text-aviation-orange text-[10px] font-bold flex items-center justify-center rounded-full transition-all">
    ${index + 1}
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const droneGhostIcon = (heading: number) => L.divIcon({
  className: 'drone-ghost-icon',
  html: `
    <div style="transform: rotate(${heading}deg)" class="relative transition-transform duration-100">
      <div class="w-10 h-10 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
          <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#f97316" stroke="white" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 border border-aviation-orange/30 rounded-full animate-ping opacity-20"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const MapEngine: React.FC = () => {
  const { 
    flightPath, 
    mapMode, 
    updatePoint, 
    selectedWaypointIndex, 
    setSelectedWaypointIndex,
    isSimulating,
    simPosition,
    telemetry
  } = useStore();
  
  const [mapCenter] = useState<[number, number]>([12.9716, 77.5946]); // Bangalore Center
  
  const pathPositions = useMemo(() => flightPath.map(p => [p.lat, p.lng] as [number, number]), [flightPath]);

  return (
    <div className="relative w-full h-full bg-slate-950">
      <MapContainer 
        center={mapCenter} 
        zoom={12} 
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <MapResizer />
        <MapHandlerController />
        <MapInteractions />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {RESTRICTED_ZONES.map(zone => (
            <Polygon
                key={zone.id}
                positions={zone.coordinates.map(c => [c.lat, c.lng])}
                pathOptions={{ 
                    color: zone.type === ZoneType.CRITICAL ? '#ef4444' : zone.type === ZoneType.RESTRICTED ? '#eab308' : '#6366f1',
                    fillOpacity: 0.15,
                    weight: 2
                }}
            >
                <Tooltip sticky className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg font-mono text-[10px] px-2 py-1">
                  <div className="uppercase">
                    <span className="font-bold text-slate-400 text-[8px] tracking-widest">{zone.type} AIRSPACE</span><br/>
                    <span className="text-sm font-bold text-white">{zone.name}</span>
                  </div>
                </Tooltip>
            </Polygon>
        ))}

        {pathPositions.length > 0 && (
          <>
            <Polyline 
                positions={pathPositions} 
                pathOptions={{ color: '#f97316', weight: 4, opacity: 0.8, dashArray: '10, 10' }} 
            />
            {pathPositions.map((pos, idx) => (
              <Marker 
                key={idx} 
                position={pos} 
                icon={waypointIcon(idx, selectedWaypointIndex === idx)} 
                draggable={mapMode === 'DRAW' && !isSimulating}
                eventHandlers={{ 
                  dragend: (e) => {
                    const latlng = e.target.getLatLng();
                    updatePoint(idx, { lat: latlng.lat, lng: latlng.lng });
                  },
                  click: () => setSelectedWaypointIndex(idx)
                }}
              />
            ))}
          </>
        )}

        {isSimulating && simPosition && (
          <Marker 
            position={[simPosition.lat, simPosition.lng]} 
            icon={droneGhostIcon(telemetry.heading)}
            zIndexOffset={1000}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapEngine;
