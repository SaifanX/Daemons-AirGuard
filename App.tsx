
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MissionControl from './components/MissionControl';
import UnifiedLanding from './pages/UnifiedLanding';
import HackathonInfo from './pages/HackathonInfo';

const TitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const baseTitle = "AirGuard | Drone Safety Assistant";
    const titles: Record<string, string> = {
      "/": "AirGuard | Home - TechnoFest 2026 Winner",
      "/app": "AirGuard | Mission Control - Active Drone Safety",
      "/hackathon": "AirGuard | TechnoFest 2026 - Stonehill International School",
      "/mission-control": "AirGuard | Mission Control"
    };

    document.title = titles[location.pathname] || baseTitle;
  }, [location]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <TitleManager />
      <div className="bg-slate-950 min-h-screen">
        <Routes>
          <Route path="/" element={<UnifiedLanding />} />
          <Route path="/app" element={<MissionControl />} />
          <Route path="/hackathon" element={<HackathonInfo />} />
          <Route path="/mission-control" element={<MissionControl />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
