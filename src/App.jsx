import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ZeroGTrail from './components/ZeroGTrail';
import KonamiLaunch from './components/KonamiLaunch';
import MorseBeacon from './components/MorseBeacon';
import SatellitePing from './components/SatellitePing';

import Home from './pages/Home';
import TelemetryHub from './pages/TelemetryHub';
import GroundUplink from './pages/GroundUplink';
import GroundSupport from './pages/GroundSupport';
import Dispatches from './pages/Dispatches';

gsap.registerPlugin(ScrollTrigger);

function MainLayout() {
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        if (window.lenis) {
          window.lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div style={{ backgroundColor: '#04060a', color: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ZeroGTrail />
      <KonamiLaunch />
      <MorseBeacon />
      <SatellitePing />
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/telemetry" element={<TelemetryHub />} />
          
          <Route path="/uplink" element={<GroundUplink />} />
          <Route path="/command" element={<GroundUplink />} />

          <Route path="/gateway" element={<GroundSupport />} />
          <Route path="/node-server" element={<GroundSupport />} />
          <Route path="/contact" element={<GroundSupport />} />

          <Route path="/dispatches" element={<Dispatches />} />
          <Route path="/news" element={<Dispatches />} />

          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis;

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}
