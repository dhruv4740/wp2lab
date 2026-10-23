import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import LaunchOverlay from './components/LaunchOverlay';
import CodePanel from './components/CodePanel';

import Home from './pages/Home';
import TelemetryHub from './pages/TelemetryHub';
import GroundUplink from './pages/GroundUplink';
import GroundSupport from './pages/GroundSupport';
import Dispatches from './pages/Dispatches';
import CrewRegistry from './pages/CrewRegistry';
import Students from './pages/Students';
import Experiments from './pages/Experiments';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import About from './pages/About';
import Team from './pages/Team';
import Company from './pages/Company';
import Contact from './pages/Contact';
import NewsFeed from './pages/NewsFeed';
import UplinkCommand from './pages/UplinkCommand';
import NodeServerConsole from './pages/NodeServerConsole';

function MainLayout() {
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ backgroundColor: '#04060a', color: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LaunchOverlay />
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/telemetry" element={<TelemetryHub />} />
          <Route path="/uplink" element={<GroundUplink />} />
          <Route path="/gateway" element={<GroundSupport />} />
          <Route path="/news" element={<Dispatches />} />
          <Route path="/dispatches" element={<Navigate to="/news" replace />} />
          <Route path="/crew" element={<CrewRegistry />} />
          <Route path="/students" element={<Students />} />

          <Route path="/experiments" element={<Experiments />} />
          <Route path="/experiments/contact" element={<Contact />} />
          <Route path="/experiments/news" element={<NewsFeed />} />
          <Route path="/experiments/uplink" element={<UplinkCommand />} />
          <Route path="/experiments/node-console" element={<NodeServerConsole />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/about" element={<About />}>
            <Route index element={<Navigate to="team" replace />} />
            <Route path="team" element={<Team />} />
            <Route path="company" element={<Company />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CodePanel />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}
