import { spawn, execSync } from 'child_process';
import signale from 'signale';
import { openSync } from 'fs';

export function autoUpdate(): boolean {
  const output = execSync('git pull').toString();
  if (output === 'Already up to date.\n') {
    signale.info('Tried to update but we are up to date');
    return false;
  }

  signale.info('Restarting process due to update');

  const file = 'logs/latest-out.log';
  const out = openSync(file, 'a');
  const err = openSync(file, 'a');

  spawn(process.argv[1], process.argv.slice(2), {
    detached: true,
    stdio: [ 'ignore', out, err ]
  }).unref();
  process.exit();
  return true;
}