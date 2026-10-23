import { build } from 'vite';
import react from '@vitejs/plugin-react';

console.log('Building SomaiyaSat Mission Web Platform...');
await build({
  configFile: false,
  plugins: [react()]
});
console.log('Build completed successfully!');
