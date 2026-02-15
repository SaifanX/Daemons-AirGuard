
import * as turf from '@turf/turf';
import { Coordinate, DroneSettings, ZoneType } from '../types';
import { RESTRICTED_ZONES } from '../data/zones';

export const calculatePathRisk = (
  path: Coordinate[],
  settings: DroneSettings
): { riskScore: number; violations: string[] } => {
  let riskScore = 0;
  const violations: string[] = [];

  if (path.length < 2) return { riskScore: 0, violations: [] };

  const lineCoordinates = path.map(p => [p.lng, p.lat]);
  const line = turf.lineString(lineCoordinates);

  // 1. Precise Altitude Risk (Regulatory limit: 120m AGL)
  if (settings.altitude > 120) {
    const altExcess = settings.altitude - 120;
    // Base 40% risk for any violation, plus 0.2% per meter over 120m
    const altRisk = Math.min(60, 40 + (altExcess * 0.15));
    riskScore += altRisk;
    violations.push(`ALTITUDE_VIOLATION: ${settings.altitude}m exceeds Rule 33 ceiling (120m).`);
  } else if (settings.altitude > 100) {
    // Warning zone risk
    riskScore += (settings.altitude - 100) * 0.5;
  }

  // 2. Path Distance Risk (BVLOS threshold: 2km for civilian pilots)
  const lengthKm = turf.length(line, { units: 'kilometers' });
  if (lengthKm > 2) {
    const distRisk = Math.min(30, (lengthKm - 2) * 8);
    riskScore += distRisk;
    if (lengthKm > 4) {
      violations.push(`BVLOS_WARNING: Mission length ${lengthKm.toFixed(2)}km exceeds visual line of sight.`);
    }
  }

  // 3. Proximity-based Airspace Risk
  RESTRICTED_ZONES.forEach(zone => {
    const polyCoords = zone.coordinates.map(c => [c.lng, c.lat]);
    polyCoords.push(polyCoords[0]);
    const polygon = turf.polygon([polyCoords]);

    // Check intersection
    const intersects = turf.booleanIntersects(line, polygon);
    
    // Check proximity to zone boundaries
    const distanceToZone = turf.pointToLineDistance(
      turf.point(lineCoordinates[0]), 
      turf.polygonToLine(polygon) as any, 
      { units: 'kilometers' }
    );

    if (intersects) {
      if (zone.type === ZoneType.CRITICAL) {
        riskScore = 100;
        violations.push(`NFZ_BREACH: Flight path penetrates Critical No-Fly Zone (${zone.name}).`);
      } else if (zone.type === ZoneType.RESTRICTED) {
        riskScore = Math.max(riskScore, 85);
        violations.push(`RESTRICTED_AIRSPACE: Unauthorized entry in ${zone.name}.`);
      }
    } else {
      // Proximity alerts (within 1km of critical zones)
      if (zone.type === ZoneType.CRITICAL && distanceToZone < 1) {
        const proximityRisk = (1 - distanceToZone) * 40;
        riskScore += proximityRisk;
        if (distanceToZone < 0.3) {
          violations.push(`PROXIMITY_ALERT: Critical distance to ${zone.name} (<300m).`);
        }
      }
    }
  });

  // Calculate final score with a ceiling of 100
  return { 
    riskScore: parseFloat(Math.min(riskScore, 100).toFixed(2)), 
    violations 
  };
};
