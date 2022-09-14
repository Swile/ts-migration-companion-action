"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTscOutput = void 0;
const node_path_1 = __importDefault(require("node:path"));
function normalizeFilepath(filepath) {
    const extension = node_path_1.default.extname(filepath);
    const basepath = node_path_1.default.join(node_path_1.default.dirname(filepath), node_path_1.default.basename(filepath, extension));
    return {
        basepath,
        extension,
    };
}
function parseTscOutput(output, include) {
    const ast = output
        .split('\n')
        .filter((line) => include.some((prefix) => line.startsWith(prefix)))
        .map(parseErrorLine);
    return ast;
}
exports.parseTscOutput = parseTscOutput;
function parseErrorLine(line) {
    const filepath = line.substring(0, line.indexOf('('));
    const position = line.substring(line.indexOf('(') + 1, line.indexOf(')'));
    const error = line.substring(line.indexOf(': error ') + ': error '.length);
    const code = error.substring(0, error.indexOf(': '));
    const message = error.substring(error.indexOf(': ') + 2);
    const { basepath, extension } = normalizeFilepath(filepath);
    return { basepath, extension, position, error, code, message };
}
//# sourceMappingURL=parser.js.map