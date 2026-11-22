import React from 'react';
import Hero from '../components/Hero';
import MissionBrief from '../components/MissionBrief';
import TechCapabilities from '../components/TechCapabilities';
import MissionTimeline from '../components/MissionTimeline';

export default function Home() {
  return (
    <div style={{ overflowX: 'hidden', backgroundColor: '#04060a' }}>
      <Hero />
      <MissionBrief />
      <TechCapabilities />
      <MissionTimeline />
    </div>
  );
}
