const fs = require('fs');

const IN = 'config.in.js';
const OUT = 'config.js';

// copy default configuration if not exists
if (!fs.existsSync(OUT)) {
  fs.copyFileSync(IN, OUT);
}