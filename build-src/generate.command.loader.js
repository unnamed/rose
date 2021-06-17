const fs = require('fs');

const extension = '.ts';
const suffix = `.command${extension}`;

let generated = require('./index').importsHeader;
// add command manager import
generated += 'const command_manager_1 = require(\'../command/command.manager\');';
// register the default element creators
generated += 'require(\'../command/default.elements\');';

// listener identifiers
const identifiers = [];

// read and append imports
fs.readdirSync(`${__dirname}/../src/command/summary/`).forEach(name => {
	if (name.endsWith(suffix)) {
		const canonName = name.slice(0, -extension.length);
		const identifier = canonName.replace('.', '_') + identifiers.length;
		generated += `const ${identifier} = __importDefault(require("../command/summary/${canonName}"));`;
		identifiers.push(identifier);
	}
});

const registerCalls = identifiers
	.map(identifier => `command_manager_1.register(${identifier}.default);`)
	.join('\n');

// append the load function
generated += `
exports.default = () => {
    ${registerCalls}
    log_1.default.info(\`Successfully loaded ${identifiers.length} commands\`);
};
`;

fs.writeFileSync(`${__dirname}/../build/loader/command.loader.js`, generated, { encoding: 'utf-8' });