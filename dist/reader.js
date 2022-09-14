"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTscOutputByFilepath = void 0;
const promises_1 = __importDefault(require("fs/promises"));
async function readTscOutputByFilepath(filepath) {
    return await promises_1.default.readFile(filepath, { encoding: 'utf8' });
}
exports.readTscOutputByFilepath = readTscOutputByFilepath;
//# sourceMappingURL=reader.js.map