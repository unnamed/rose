import { spawn, execSync } from 'child_process';
import signale from 'signale';

export function autoUpdate(): boolean {
  const output = execSync('git pull').toString();

  if (output === 'Already up to date.\n') {
    signale.info('Tried to update but we are up to date');
    return false;
  }

  signale.info('Restarting process due to update');

  spawn(process.argv[0], process.argv.slice(1), {
    cwd: process.cwd(),
    detached: true,
    stdio: 'inherit'
  }).unref();
  process.exit();
  return true;
}