#!/usr/bin/env node
/*
 * Script to create 'config.js' file if it doesn't exist,
 * it's copied from 'config.in.js' (default configuration)
 */

const fs = require('fs');
const input = 'config.in.js';
const output = 'config.js';

try {
  fs.copyFileSync(input, output, fs.constants.COPYFILE_EXCL);
} catch {
  // ignored
}
