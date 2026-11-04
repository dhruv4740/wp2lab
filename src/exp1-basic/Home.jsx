// Exp 1: Home page, built by putting two smaller components together (Hero and LatestNews).
import React from 'react';
import Hero from './Hero';
import LatestNews from '../exp4-api/LatestNews';

export default function Home() {
  return (
    <div style={{ overflowX: 'hidden', backgroundColor: '#04060a' }}>
      <Hero />
      <LatestNews />
    </div>
  );
}
