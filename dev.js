import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

const port = parseInt(process.env.PORT || process.argv[2] || '3000', 10);

const server = await createServer({
  configFile: false,
  root: process.cwd(),
  plugins: [react()],
  server: {
    port: port,
    host: true,
    strictPort: false
  }
});

await server.listen();
server.printUrls();

// Keep node event loop alive indefinitely
setInterval(() => {}, 60000);

