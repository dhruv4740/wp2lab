// Home page: composed from smaller components (Hero, Explainer, HowItWorks, LatestNews).
import React from 'react';
import Hero from '../components/Hero';
import Explainer from '../components/Explainer';
import HowItWorks from '../components/HowItWorks';
import LatestNews from '../components/LatestNews';

export default function Home() {
  return (
    <div style={{ overflowX: 'hidden', backgroundColor: '#04060a' }}>
      <Hero />
      <Explainer />
      <HowItWorks />
      <LatestNews />
    </div>
  );
}
