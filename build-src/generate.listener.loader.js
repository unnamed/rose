const fs = require('fs');

const extension = '.ts';
const suffix = `.listener${extension}`;

// supposed to be in build/loader/
let generated = require('./index').importsHeader;

// listener identifiers
const identifiers = [];

// read and append imports
fs.readdirSync(`${__dirname}/../src/listener/`).forEach(name => {
	if (name.endsWith(suffix)) {
		const canonName = name.slice(0, -extension.length);
		const identifier = canonName.replace('.', '_') + identifiers.length;
		generated += `const ${identifier} = __importDefault(require("../listener/${canonName}"));`;
		identifiers.push(identifier);
	}
});

const registerCalls = identifiers
	.map(identifier => `register(${identifier}.default);`)
	.join('\n');

// append the load function
generated += `
exports.default = (client) => {
    const register = ({ event, execute }) => client.on(event, execute);
    ${registerCalls}
    log_1.default.info(\`Successfully loaded ${identifiers.length} event listeners\`);
};
`;

fs.writeFileSync(`${__dirname}/../build/loader/listener.loader.js`, generated, { encoding: 'utf-8' });