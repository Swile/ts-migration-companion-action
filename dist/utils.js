"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToString = void 0;
function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}
exports.streamToString = streamToString;
//# sourceMappingURL=utils.js.map