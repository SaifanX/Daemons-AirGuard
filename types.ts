
export interface Coordinate {
  lat: number;
  lng: number;
}

export enum ZoneType {
  CRITICAL = 'CRITICAL', // Red
  RESTRICTED = 'RESTRICTED', // Yellow
  CONTROLLED = 'CONTROLLED', // Blue
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  coordinates: Coordinate[];
}

export interface DroneSettings {
  altitude: number;
  model: 'Nano (<250g)' | 'Micro (>2kg)';
}

export interface WeatherData {
  temp: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  condition: 'Clear' | 'Cloudy' | 'Rain' | 'Storm';
  isFlyable: boolean;
}

export interface TelemetryData {
  speed: number;
  heading: number;
  battery: number;
  altitudeAGL: number;
}

export interface SavedMission {
  id: string;
  name: string;
  timestamp: number;
  path: Coordinate[];
  settings: DroneSettings;
}

export type MapMode = 'PAN' | 'DRAW' | 'SEARCH';

export interface UiVisibility {
  sidebar: boolean;
  riskMeter: boolean;
  weatherWidget: boolean;
  aiAssistant: boolean;
  settings: boolean;
}

export type SimScenario = 'STANDARD' | 'HEAVY_WEATHER' | 'HIGH_ALTITUDE';

export interface AppState {
  flightPath: Coordinate[];
  riskLevel: number;
  violations: string[];
  droneSettings: DroneSettings;
  telemetry: TelemetryData;
  weather: WeatherData;
  mapMode: MapMode;
  uiVisible: boolean;
  uiElements: UiVisibility;
  selectedWaypointIndex: number | null;
  
  // Simulation State
  isSimulating: boolean;
  simProgress: number; // 0 to 1
  simPosition: Coordinate | null;
  simFollowMode: boolean;
  simSpeedMultiplier: number;
  
  // Persistence & Settings
  savedMissions: SavedMission[];
  userApiKey: string;
  
  // Actions
  addPoint: (point: Coordinate) => void;
  updatePoint: (index: number, point: Coordinate) => void;
  removeLastPoint: () => void;
  clearPath: () => void;
  updateSettings: (settings: Partial<DroneSettings>) => void;
  calculateRisk: () => void;
  refreshWeather: () => void;
  setSelectedWaypointIndex: (index: number | null) => void;
  setMapMode: (mode: MapMode) => void;
  toggleUi: () => void;
  toggleUiElement: (element: keyof UiVisibility) => void;
  
  // Simulation Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  setSimProgress: (progress: number) => void;
  setSimPosition: (pos: Coordinate | null) => void;
  toggleFollowMode: () => void;
  setSimSpeedMultiplier: (speed: number) => void;
  applyScenario: (scenario: SimScenario) => void;
  updateTelemetry: (data: Partial<TelemetryData>) => void;

  // Persistence Actions
  saveMission: (name: string) => void;
  loadMission: (id: string) => void;
  deleteMission: (id: string) => void;
  setApiKey: (key: string) => void;
}
