// common code in generated sources
// supposed to be written in the 'loader'
// directory
module.exports.importsHeader = `
// generated sources
'use strict';

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};

Object.defineProperty(exports, '__esModule', { value: true });

const log_1 = __importDefault(require('../log'));
`;

// execute the generators
require('./generate.listener.loader');
require('./generate.command.loader');