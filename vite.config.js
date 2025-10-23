import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Determine the base path for the built assets. GitHub Pages hosts project
// sites under https://<user>.github.io/<repo>/ so we normalise whatever hint
// we have (environment override, GitHub Actions context or the npm package
// name) into the "/repo/" format. Falling back to '/' keeps local development
// working without extra configuration.
const envBasePath = process.env.VITE_BASE_PATH || process.env.BASE_PATH;
const repoFromActions = process.env.GITHUB_REPOSITORY?.split('/')[1];
const packageName = process.env.npm_package_name;

const rawBasePath = envBasePath || repoFromActions || packageName || '/';

const normalisedBasePath = (() => {
  if (rawBasePath === '/' || rawBasePath === './') {
    return '/';
  }

  const trimmed = rawBasePath.replace(/^\/?(.+?)\/?$/, '$1');
  return trimmed ? `/${trimmed}/` : '/';
})();

export default defineConfig({
  base: normalisedBasePath,
  plugins: [react()],
});
