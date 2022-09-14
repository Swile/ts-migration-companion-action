"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorByFileReport = void 0;
function groupByFileReport(report, { basepath, code }) {
    const byFileBasePath = [...(report[basepath] ?? []), code];
    report[basepath] = byFileBasePath;
    return report;
}
function combineReportByFilename(report) {
    return Object.entries(report).map(([basepath, errors]) => ({
        basepath,
        count: errors.length,
    }));
}
function getErrorByFileReport(ast) {
    const report = ast.reduce(groupByFileReport, {});
    return combineReportByFilename(report);
}
exports.getErrorByFileReport = getErrorByFileReport;
//# sourceMappingURL=analyzer.js.map