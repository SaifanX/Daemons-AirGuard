
import React, { useEffect, useRef } from 'react';
import { useStore } from '../store';
import * as turf from '@turf/turf';

const SimulationEngine: React.FC = () => {
  const { 
    isSimulating, 
    flightPath, 
    setSimProgress, 
    setSimPosition, 
    updateTelemetry,
    droneSettings,
    stopSimulation,
    simSpeedMultiplier
  } = useStore();
  
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);
  
  // Base speed of the drone in m/s
  const baseDroneSpeed = droneSettings.model.includes('Nano') ? 5 : 12;
  
  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    
    if (flightPath.length < 2) {
      stopSimulation();
      return;
    }

    const line = turf.lineString(flightPath.map(p => [p.lng, p.lat]));
    const totalLength = turf.length(line, { units: 'meters' });
    
    // Calculate elapsed time adjusted by multiplier
    const elapsedSeconds = (time - startTimeRef.current) / 1000;
    const distanceTraveled = elapsedSeconds * baseDroneSpeed * simSpeedMultiplier;
    
    const progress = Math.min(distanceTraveled / totalLength, 1);
    
    if (progress >= 1) {
      stopSimulation();
      return;
    }

    const currentPoint = turf.along(line, distanceTraveled, { units: 'meters' });
    const coords = currentPoint.geometry.coordinates;
    
    // Calculate heading
    const lookAheadDistance = Math.min(distanceTraveled + 2, totalLength);
    const lookAheadPoint = turf.along(line, lookAheadDistance, { units: 'meters' });
    const bearing = turf.bearing(currentPoint, lookAheadPoint);

    setSimProgress(progress);
    setSimPosition({ lat: coords[1], lng: coords[0] });
    
    // Update Telemetry
    updateTelemetry({
      speed: baseDroneSpeed * simSpeedMultiplier,
      heading: bearing,
      battery: 100 - (progress * 15),
      altitudeAGL: droneSettings.altitude
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isSimulating) {
      startTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isSimulating]);

  return null;
};

export default SimulationEngine;
