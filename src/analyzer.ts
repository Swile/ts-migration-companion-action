import {type ParsedTsError} from './parser'

export interface TsReport {
  [basepath: string]: string[]
}

export interface TsErrorByFile {
  basepath: string
  count: number
}

function groupByFileReport(
  report: TsReport,
  {basepath, code}: ParsedTsError
): TsReport {
  const byFileBasePath = [...(report[basepath] ?? []), code]
  report[basepath] = byFileBasePath
  return report
}

function combineReportByFilename(report: TsReport): TsErrorByFile[] {
  return Object.entries(report).map(([basepath, errors]) => ({
    basepath,
    count: errors.length
  }))
}

export function getErrorByFileReport(ast: ParsedTsError[]): TsErrorByFile[] {
  const report: TsReport = ast.reduce(groupByFileReport, {})
  return combineReportByFilename(report)
}
