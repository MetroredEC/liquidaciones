import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const normalizeBasePath = (value) => {
  if (!value) return '/';
  let base = value.trim();
  if (!base.startsWith('/')) {
    base = `/${base}`;
  }
  if (!base.endsWith('/')) {
    base = `${base}/`;
  }
  return base;
};

const resolveBasePath = () => {
  if (process.env.VITE_BASE_PATH) {
    return normalizeBasePath(process.env.VITE_BASE_PATH);
  }

  const repositorySlug = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (repositorySlug) {
    return normalizeBasePath(repositorySlug);
  }

  return '/';
};

export default defineConfig(() => ({
  base: resolveBasePath(),
  plugins: [react()],
}));
