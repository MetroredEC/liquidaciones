import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// When building in GitHub Actions we infer the repository name and use it as
// the Vite base path so the generated assets resolve correctly when hosted
// from a project site such as <user>.github.io/<repo>/. For local development
// and other environments we keep the default root base path.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const base = isGitHubPages && repoName ? `/${repoName}/` : '/';

export default defineConfig({
  base,
  plugins: [react()],
});
