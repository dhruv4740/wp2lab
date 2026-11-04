// App shell: React Router decides which page to show for each URL (Exp 3 navigation).
// AuthProvider (Context API) shares the signed-in user with every page.
// Folder names tell you the experiment: exp1-basic, exp2-hooks, exp3-forms, exp4-api, exp5-node, exp6-express, exp8-mern.
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './exp3-forms/AuthContext';
import Navbar from './shared/Navbar';
import AuthModal from './exp3-forms/AuthModal';

import Home from './exp1-basic/Home';
import About from './exp1-basic/About';
import Team from './exp1-basic/Team';
import Company from './exp1-basic/Company';
import Students from './exp8-mern/Students';
import LoginForm from './exp3-forms/LoginForm';
import RegisterForm from './exp3-forms/RegisterForm';
import Contact from './exp3-forms/Contact';
import Dispatches from './exp4-api/Dispatches';
import GroundUplink from './exp5-node/GroundUplink';
import GroundSupport from './exp5-node/GroundSupport';
import CrewRegistry from './exp6-express/CrewRegistry';
import TelemetryHub from './mission-site/TelemetryHub';
import PassMonitor from './ps-passmonitor/PassMonitor';

function MainLayout() {
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Scroll to the top whenever the page (URL path) changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ backgroundColor: '#04060a', color: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Exp 1: basic pages. /about has nested child routes shown inside its <Outlet /> */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />}>
            <Route index element={<Navigate to="team" replace />} />
            <Route path="team" element={<Team />} />
            <Route path="company" element={<Company />} />
          </Route>
          {/* Exp 2 and 8: students page (hooks + REST API) */}
          <Route path="/students" element={<Students />} />
          {/* Exp 3: forms */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/experiments/contact" element={<Contact />} />
          {/* Exp 4: API data */}
          <Route path="/news" element={<Dispatches />} />
          {/* Exp 5: Node server console */}
          <Route path="/uplink" element={<GroundUplink />} />
          <Route path="/gateway" element={<GroundSupport />} />
          {/* Exp 7: MongoDB crew registry */}
          <Route path="/crew" element={<CrewRegistry />} />
          {/* Mission site + problem-statement pages */}
          <Route path="/telemetry" element={<TelemetryHub />} />
          <Route path="/monitor" element={<PassMonitor />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
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
