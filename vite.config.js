import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Metrored Cartera application.
// The `base` option is set to a relative path so that the app can be
// hosted from a subdirectory, which is typical for GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
});