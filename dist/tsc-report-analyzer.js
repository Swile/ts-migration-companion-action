#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const analyzer_1 = require("./analyzer");
const parser_1 = require("./parser");
const sorter_1 = require("./sorter");
const utils_1 = require("./utils");
async function main() {
    const commandLineArgs = await (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .option('sources', {
        type: 'array',
        description: 'Source folders to analyze (eg: src, lib, ...)',
        default: ['src'],
    })
        .parse();
    const tscOutput = await (0, utils_1.streamToString)(process.stdin);
    const ast = (0, parser_1.parseTscOutput)(tscOutput, commandLineArgs.sources);
    const errors = (0, analyzer_1.getErrorByFileReport)(ast).sort(sorter_1.sortByCount);
    console.table(errors);
}
main();
//# sourceMappingURL=tsc-report-analyzer.js.map