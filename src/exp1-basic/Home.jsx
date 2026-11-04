// Home page: composed from smaller components (Hero, Explainer, HowItWorks, LatestNews).
import React from 'react';
import Hero from './Hero';
import Explainer from './Explainer';
import HowItWorks from './HowItWorks';
import LatestNews from '../exp4-api/LatestNews';

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
