/* eslint-disable github/array-foreach */
import {getErrorByFileReport} from './analyzer'
import {getMarkdownReportComparator, type MergedTsErrorByFile} from './report'
import {ParsedTsError, parseTscOutput} from './parser'
import {readTscOutputByFilepath} from './reader'

type ComparatorArgs = {
  masterTscOutputPath: string
  prTscOutputPath: string
  tscRootDir: string
}

async function comparator({
  masterTscOutputPath,
  prTscOutputPath,
  tscRootDir
}: ComparatorArgs): Promise<string> {
  const masterTscOutput = await readTscOutputByFilepath(masterTscOutputPath)
  const prTscOutput = await readTscOutputByFilepath(prTscOutputPath)

  const masterAst = parseTscOutput(masterTscOutput, [tscRootDir])
  const prAst = parseTscOutput(prTscOutput, [tscRootDir])

  const masterReport = getErrorByFileReport(masterAst)
  const prReport = getErrorByFileReport(prAst)

  const mergedReport: MergedTsErrorByFile[] = []

  masterReport.forEach(masterError => {
    const prError = prReport.find(
      item => item.basepath === masterError.basepath
    )
    mergedReport.push({
      basepath: masterError.basepath,
      master: masterError.count,
      pr: prError?.count ?? 0
    })
  })

  prReport.forEach(prError => {
    const masterError = prReport.find(
      ({basepath}) => basepath === prError.basepath
    )
    const mergedError = mergedReport.find(
      ({basepath}) => basepath === prError.basepath
    )
    if (mergedError) {
      // Skip already merged errors
      return
    }

    mergedReport.push({
      basepath: prError.basepath,
      master: masterError?.count ?? 0,
      pr: prError.count
    })
  })

  // Files without error in master
  const openedList = mergedReport.filter(merged => {
    return merged.master === 0 && merged.pr > 0
  })

  // Files without error in pr
  const fixedList = mergedReport.filter(merged => {
    return merged.pr === 0 && merged.master > 0
  })

  // Files with error count higher in pr than master
  const increasedList = mergedReport.filter(merged => {
    return merged.pr > merged.master && merged.master > 0
  })

  // Detailed list of tsc errors
  const increasedDetails = increasedList.reduce((map, error) => {
    const details = prAst.filter(value => value.basepath === error.basepath)
    map.set(error.basepath, details)
    return map
  }, new Map<string, ParsedTsError[]>())

  // Files with error count lower in pr than master
  const decreasedList = mergedReport.filter(merged => {
    return merged.pr < merged.master && merged.pr > 0
  })

  return getMarkdownReportComparator({
    global: {
      master: masterAst.length,
      pr: prAst.length
    },
    openedList,
    fixedList,
    increasedList,
    increasedDetails,
    decreasedList
  })
}

export default comparator
