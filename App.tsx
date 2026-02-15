
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MissionControl from './components/MissionControl';
import UnifiedLanding from './pages/UnifiedLanding';

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-slate-950 min-h-screen">
        <Routes>
          <Route path="/" element={<UnifiedLanding />} />
          <Route path="/app" element={<MissionControl />} />
          {/* Legacy route handling */}
          <Route path="/mission-control" element={<MissionControl />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
