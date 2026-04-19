import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Generate a unique build ID per push: prefer the git short SHA, fall back to a timestamp.
function getBuildId() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return `t${Date.now()}`;
  }
}

const BUILD_ID = getBuildId();

// Vite plugin: after the bundle is written, replace `__BUILD_ID__` inside dist/sw.js
// so the browser sees a brand-new CACHE_NAME on every deploy.
function stampServiceWorker() {
  return {
    name: 'stamp-service-worker',
    apply: 'build',
    closeBundle() {
      const swPath = resolve(__dirname, 'dist', 'sw.js');
      if (!existsSync(swPath)) return;
      const src = readFileSync(swPath, 'utf8');
      writeFileSync(swPath, src.replace(/__BUILD_ID__/g, BUILD_ID));
      // eslint-disable-next-line no-console
      console.log(`[sw] stamped build id: ${BUILD_ID}`);
    },
  };
}

export default defineConfig({
  plugins: [react(), stampServiceWorker()],
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
