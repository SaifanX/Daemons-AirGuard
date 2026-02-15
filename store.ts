
import { create } from 'zustand';
import { AppState, WeatherData, TelemetryData, Coordinate, SavedMission, SimScenario } from './types';
import { calculatePathRisk } from './utils/flightLogic';

const STORAGE_KEY = 'airguard_missions';
const API_KEY_STORAGE = 'airguard_api_key';

const generateWeather = (override?: Partial<WeatherData>): WeatherData => {
  const windSpeed = override?.windSpeed ?? Math.floor(Math.random() * 35);
  const visibility = override?.visibility ?? Math.floor(Math.random() * 12);
  const condition = override?.condition ?? (windSpeed > 30 ? 'Storm' : (windSpeed > 20 ? 'Cloudy' : 'Clear'));
  const isStorm = condition === 'Storm';
  
  return {
    temp: 24 + Math.floor(Math.random() * 5),
    windSpeed: windSpeed,
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    visibility: visibility,
    condition: condition,
    isFlyable: !isStorm && windSpeed < 28 && visibility >= 3
  };
};

const initialTelemetry: TelemetryData = {
  speed: 0,
  heading: 0,
  battery: 100,
  altitudeAGL: 0
};

const getSavedMissions = (): SavedMission[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const getPersistedApiKey = (): string => {
  return localStorage.getItem(API_KEY_STORAGE) || '';
};

export const useStore = create<AppState>()((set, get) => ({
  flightPath: [],
  riskLevel: 0,
  violations: [],
  droneSettings: {
    altitude: 60,
    model: 'Nano (<250g)',
  },
  telemetry: initialTelemetry,
  weather: generateWeather(),
  mapMode: 'DRAW',
  uiVisible: true,
  uiElements: {
    sidebar: true,
    riskMeter: true,
    weatherWidget: true,
    aiAssistant: true,
    settings: false,
  },
  selectedWaypointIndex: null,
  
  // Simulation
  isSimulating: false,
  simProgress: 0,
  simPosition: null,
  simFollowMode: false,
  simSpeedMultiplier: 1,

  savedMissions: getSavedMissions(),
  userApiKey: getPersistedApiKey(),

  addPoint: (point) => {
    const newPath = [...get().flightPath, point];
    set({ flightPath: newPath });
    get().calculateRisk();
  },

  updatePoint: (index, point) => {
    const newPath = [...get().flightPath];
    if (index >= 0 && index < newPath.length) {
      newPath[index] = point;
      set({ flightPath: newPath });
      get().calculateRisk();
    }
  },

  removeLastPoint: () => {
    const newPath = get().flightPath.slice(0, -1);
    set({ flightPath: newPath });
    get().calculateRisk();
  },

  clearPath: () => set({ 
    flightPath: [], 
    riskLevel: 0, 
    violations: [],
    selectedWaypointIndex: null,
    isSimulating: false,
    simProgress: 0,
    simPosition: null
  }),

  updateSettings: (newSettings) => {
    set((state) => ({
      droneSettings: { ...state.droneSettings, ...newSettings }
    }));
    get().calculateRisk();
  },

  calculateRisk: () => {
    const { flightPath, droneSettings, weather } = get();
    let { riskScore, violations } = calculatePathRisk(flightPath, droneSettings);
    
    if (!weather.isFlyable) {
      riskScore = 100;
      violations = [...violations, `WEATHER: unsafe conditions (${weather.condition})`];
    } else if (weather.windSpeed > 15) {
      riskScore += 20;
      violations = [...violations, `WEATHER: High winds (${weather.windSpeed}km/h)`];
    }

    set({ riskLevel: Math.min(riskScore, 100), violations });
  },

  refreshWeather: () => {
    set({ weather: generateWeather() });
    get().calculateRisk();
  },

  setSelectedWaypointIndex: (index) => set({ selectedWaypointIndex: index }),

  setMapMode: (mode) => set({ mapMode: mode }),
  toggleUi: () => set(state => ({ uiVisible: !state.uiVisible })),
  toggleUiElement: (element) => {
    set(state => ({
      uiElements: {
        ...state.uiElements,
        [element] : !state.uiElements[element]
      }
    }));
  },

  // Simulation Actions
  startSimulation: () => {
    if (get().flightPath.length < 2) return;
    set({ isSimulating: true, simProgress: 0 });
  },
  stopSimulation: () => set({ isSimulating: false, simProgress: 0, simPosition: null }),
  setSimProgress: (progress) => set({ simProgress: progress }),
  setSimPosition: (pos) => set({ simPosition: pos }),
  toggleFollowMode: () => set(state => ({ simFollowMode: !state.simFollowMode })),
  setSimSpeedMultiplier: (speed) => set({ simSpeedMultiplier: speed }),
  
  applyScenario: (scenario) => {
    if (scenario === 'STANDARD') {
      set({ weather: generateWeather({ windSpeed: 5, visibility: 10, condition: 'Clear' }) });
      get().updateSettings({ altitude: 60 });
    } else if (scenario === 'HEAVY_WEATHER') {
      set({ weather: generateWeather({ windSpeed: 35, visibility: 2, condition: 'Storm' }) });
      get().updateSettings({ altitude: 40 });
    } else if (scenario === 'HIGH_ALTITUDE') {
      set({ weather: generateWeather({ windSpeed: 10, visibility: 12, condition: 'Clear' }) });
      get().updateSettings({ altitude: 150 });
    }
    get().calculateRisk();
  },

  updateTelemetry: (data) => set(state => ({ telemetry: { ...state.telemetry, ...data } })),

  saveMission: (name) => {
    const mission: SavedMission = {
      id: crypto.randomUUID(),
      name: name || `Mission ${get().savedMissions.length + 1}`,
      timestamp: Date.now(),
      path: get().flightPath,
      settings: get().droneSettings
    };
    const updated = [mission, ...get().savedMissions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ savedMissions: updated });
  },

  loadMission: (id) => {
    const mission = get().savedMissions.find(m => m.id === id);
    if (mission) {
      set({
        flightPath: mission.path,
        droneSettings: mission.settings,
        selectedWaypointIndex: null,
        isSimulating: false
      });
      get().calculateRisk();
    }
  },

  deleteMission: (id) => {
    const updated = get().savedMissions.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ savedMissions: updated });
  },

  setApiKey: (key) => {
    localStorage.setItem(API_KEY_STORAGE, key);
    set({ userApiKey: key });
  }
}));
