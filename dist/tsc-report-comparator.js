#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const analyzer_1 = require("./analyzer");
const github_1 = require("./github");
const parser_1 = require("./parser");
const reader_1 = require("./reader");
async function main(log = false) {
    const commandLineArgs = await (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .option('sources', {
        type: 'array',
        description: 'Source folders to analyze (eg: src, lib, ...)',
        default: ['src'],
    })
        .parse();
    const masterTscOutput = await (0, reader_1.readTscOutputByFilepath)('/tmp/tsc-output/master.txt');
    const prTscOutput = await (0, reader_1.readTscOutputByFilepath)('/tmp/tsc-output/pr.txt');
    const masterAst = (0, parser_1.parseTscOutput)(masterTscOutput, commandLineArgs.sources);
    const prAst = (0, parser_1.parseTscOutput)(prTscOutput, commandLineArgs.sources);
    const masterReport = (0, analyzer_1.getErrorByFileReport)(masterAst);
    const prReport = (0, analyzer_1.getErrorByFileReport)(prAst);
    const mergedReport = [];
    masterReport.forEach((masterError) => {
        const prError = prReport.find((item) => item.basepath === masterError.basepath);
        mergedReport.push({
            basepath: masterError.basepath,
            master: masterError.count,
            pr: prError?.count ?? 0,
        });
    });
    prReport.forEach((prError) => {
        const masterError = prReport.find(({ basepath }) => basepath === prError.basepath);
        const mergedError = mergedReport.find(({ basepath }) => basepath === prError.basepath);
        if (mergedError) {
            // Skip already merged errors
            return;
        }
        mergedReport.push({
            basepath: prError.basepath,
            master: masterError?.count ?? 0,
            pr: prError.count,
        });
    });
    // Files without error in master
    const openedList = mergedReport.filter((merged) => {
        return merged.master === 0 && merged.pr > 0;
    });
    // Files without error in pr
    const fixedList = mergedReport.filter((merged) => {
        return merged.pr === 0 && merged.master > 0;
    });
    // Files with error count higher in pr than master
    const increasedList = mergedReport.filter((merged) => {
        return merged.pr > merged.master && merged.master > 0;
    });
    // Detailed list of tsc errors
    const increasedDetails = increasedList.reduce((map, error) => {
        const details = prAst.filter((value) => value.basepath === error.basepath);
        map.set(error.basepath, details);
        return map;
    }, new Map());
    // Files with error count lower in pr than master
    const decreasedList = mergedReport.filter((merged) => {
        return merged.pr < merged.master && merged.pr > 0;
    });
    if (log) {
        console.log(`TypeScript Migration Companion`);
        console.log(`:clap: Fixed files in PR`);
        console.table(fixedList);
        console.log(`-`.repeat(20));
        console.log(`:muscle: Files with decreased error in PR`);
        console.table(decreasedList);
        console.log(`-`.repeat(20));
        console.log(`:scream: New files with error in PR`);
        console.table(openedList);
        console.log(`-`.repeat(20));
        console.log(`:man_shrugging: Files with increased error in PR`);
        console.table(increasedList);
    }
    return (0, github_1.getMarkdownReportComparator)({
        global: {
            master: masterAst.length,
            pr: prAst.length,
        },
        openedList,
        fixedList,
        increasedList,
        increasedDetails,
        decreasedList,
    });
}
// eslint-disable-next-line import/no-default-export
exports.default = main;
if (require.main === module) {
    main(true);
}
//# sourceMappingURL=tsc-report-comparator.js.map