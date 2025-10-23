import { execSync } from 'node:child_process';

const BASE_PATH = '/liquidaciones/';
const envWithBasePath = { ...process.env, VITE_BASE_PATH: BASE_PATH };

const run = (command, env = process.env) => {
  execSync(command, { stdio: 'inherit', env });
};

try {
  run('npx vite build', envWithBasePath);
  run('npx gh-pages -d dist');
} catch (error) {
  if (error.status) {
    process.exit(error.status);
  }
  process.exit(1);
}
