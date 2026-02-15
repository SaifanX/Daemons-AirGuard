

import { GoogleGenAI } from "@google/genai";
import { RESTRICTED_ZONES } from "../data/zones";
import { ZoneType } from "../types";
import { lineString, polygon, booleanIntersects } from '@turf/turf';

export const getCaptainCritique = async (
  userMessage: string,
  riskLevel: number,
  violations: string[],
  flightDetails: any,
  weather?: any,
  flightStats?: { distance: number; waypoints: number },
  telemetry?: { speed: number; heading: number; battery: number; altitudeAGL: number },
  path?: { lat: number, lng: number }[],
  overrideApiKey?: string
): Promise<string> => {
  const envApiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  const activeApiKey = overrideApiKey || envApiKey || '';

  if (!activeApiKey) {
    return "Please add your API key in the settings to talk to me!";
  }

  // Creating instance right before call as per performance guidelines
  const ai = new GoogleGenAI({ apiKey: activeApiKey });
  
  const weatherContext = weather 
    ? `- Weather: ${weather.condition}, Wind: ${weather.windSpeed} km/h`
    : "- Weather not available";

  let zoneContext = "The path is clear of restricted areas.";
  if (path && path.length >= 2) {
    // Fixed with named imports
    const line = lineString(path.map(p => [p.lng, p.lat]));
    const intersected = RESTRICTED_ZONES.filter(zone => {
      if (zone.type === ZoneType.CONTROLLED) return false;
      const polyCoords = [...zone.coordinates.map(c => [c.lng, c.lat]), [zone.coordinates[0].lng, zone.coordinates[0].lat]];
      const poly = polygon([polyCoords as any]);
      return booleanIntersects(line, poly);
    }).map(z => z.name);
    
    if (intersected.length > 0) zoneContext = `Danger: Path enters ${intersected.join(", ")}.`;
  }

  const systemInstruction = `
    You are a friendly flight safety helper for a student project called AirGuard.
    Keep answers short, simple, and helpful. Use simple words. No jargon.
    
    CONTEXT:
    - Risk Level: ${riskLevel}%
    - Safety Warnings: ${violations.join(", ") || "None"}
    - Drone: ${flightDetails.model} at ${flightDetails.altitude}m
    - Weather: ${weatherContext}
    - Map: ${zoneContext}

    Be encouraging and supportive to the user.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Low latency flash model
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.5, // Faster, more consistent responses
      }
    });

    return response.text || "I'm not sure, could you rephrase?";
  } catch (error: any) {
    return "Sorry, I'm having trouble connecting to my brain! Check your API key.";
  }
};