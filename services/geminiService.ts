
import { GoogleGenAI } from "@google/genai";
import { RESTRICTED_ZONES } from "../data/zones";
import * as turf from '@turf/turf';

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
  const activeApiKey = overrideApiKey || process.env.API_KEY || '';

  if (!activeApiKey) {
    return "API Configuration Error: Captain Arjun is offline. (Missing API Key in Systems Config)";
  }

  const ai = new GoogleGenAI({ apiKey: activeApiKey });
  const model = "gemini-3-flash-preview";
  
  const weatherContext = weather 
    ? `- Conditions: ${weather.condition}, Temp: ${weather.temp}°C, Wind: ${weather.windSpeed} km/h (${weather.windDirection}), Visibility: ${weather.visibility}km`
    : "- Weather data unavailable";

  const statsContext = flightStats
    ? `- Path Distance: ${flightStats.distance} km, Waypoints: ${flightStats.waypoints}`
    : "";

  const telemetryContext = telemetry
    ? `- Telemetry: Speed ${telemetry.speed.toFixed(1)}m/s, Heading ${telemetry.heading.toFixed(0)}°, Battery ${telemetry.battery.toFixed(0)}%, Alt AGL ${telemetry.altitudeAGL}m`
    : "";

  let zoneContext = "No intersections detected.";
  if (path && path.length >= 2) {
    const line = turf.lineString(path.map(p => [p.lng, p.lat]));
    const intersectedZones = RESTRICTED_ZONES.filter(zone => {
      const polyCoords = zone.coordinates.map(c => [c.lng, c.lat]);
      polyCoords.push(polyCoords[0]);
      const polygon = turf.polygon([polyCoords]);
      return turf.booleanIntersects(line, polygon);
    }).map(z => `${z.name} (${z.type})`);
    
    if (intersectedZones.length > 0) {
      zoneContext = `Path intersects with: ${intersectedZones.join(", ")}`;
    }
  }

  const systemPrompt = `
    You are Captain Arjun, a retired Indian Air Force pilot and high-ranking safety officer for the Ministry of Civil Aviation. 
    You are strict, disciplined, and speak in precise military jargon (Roger, Wilco, Negative).

    CONTEXT:
    - Current Risk Assessment: ${riskLevel}%
    - Detected Violations: ${violations.length > 0 ? violations.join(", ") : "None"}
    - Zone Data: ${zoneContext}
    - Aircraft Status: ${flightDetails.model} at ${flightDetails.altitude}m AGL
    ${weatherContext}
    ${statsContext}
    ${telemetryContext}
    
    MANDATORY REGULATORY PROTOCOL:
    1. If Risk Level is > 50%, you MUST append a "REGULATORY CITE" section at the end of your response.
    2. Quote specific rules from the "Drone Rules, 2021" of India. Examples:
       - Rule 31: Restrictions on operation in Red/Yellow zones without permission.
       - Rule 33: Vertical limits (400ft/120m).
       - Rule 34: Proximity to airport boundaries (5km perimeter).
       - Rule 28: Mandatory Remote Pilot Certificate for Micro/Small drones.
    3. Use a no-nonsense tone. If risk is 100%, you are effectively grounding the pilot.
    4. Keep your total response under 160 words. Be professional and authoritative.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
      }
    });

    return response.text || "Radio silence. Please repeat.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Comms failure. Unable to reach ATC.";
  }
};
