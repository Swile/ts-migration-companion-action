import json2md, {type DataObject} from 'json2md'

import {TsErrorByFile} from './analyzer'
import {ParsedTsError} from './parser'

interface JSONDetailsParams {
  basepath: TsErrorByFile['basepath']
  errors: ParsedTsError[]
}

json2md.converters.details = (
  {basepath, errors}: JSONDetailsParams,
  converter: json2md
): string => `
<details>
<summary>${basepath}</summary>
<p>

${converter([
  {
    table: {
      headers: ['position', 'error'],
      rows: [
        ...errors.map(error => [
          `${basepath}#L${error.position}`,
          error.message
        ])
      ]
    }
  }
])}

</p>
</details>
`

export interface MergedTsErrorByFile {
  basepath: TsErrorByFile['basepath']
  master: number
  pr: number
}

interface ReportComparator {
  global: {
    master: number
    pr: number
  }
  openedList: MergedTsErrorByFile[]
  fixedList: MergedTsErrorByFile[]
  increasedList: MergedTsErrorByFile[]
  increasedDetails: Map<string, ParsedTsError[]>
  decreasedList: MergedTsErrorByFile[]
}

function mapToMarkdownTable(map: Map<string, ParsedTsError[]>): DataObject[] {
  return map.size > 0
    ? [
        {h3: 'Details'},
        ...Array.from(map.entries()).map(([filepath, errors]) => ({
          details: {
            filepath,
            errors
          }
        }))
      ]
    : []
}

function listToMarkdownTable(
  title: string,
  errors: MergedTsErrorByFile[]
): DataObject[] {
  return errors.length > 0
    ? [
        {h2: title},
        {h3: 'Summary'},
        {
          table: {
            headers: ['filepath', 'master', 'pr'],
            rows: errors.map(Object.values)
          }
        }
      ]
    : []
}

export async function getMarkdownReportComparator({
  global,
  fixedList,
  openedList,
  increasedList,
  increasedDetails,
  decreasedList
}: ReportComparator): Promise<string> {
  return json2md([
    {h1: 'TypeScript Migration Companion'},

    {h2: 'Global error infos'},
    {
      p: 'The table below compares the error count between the master branch and your pr. Produces `master > your PR` when you reduce TypeScript problems.'
    },
    {
      table: {
        headers: ['master', 'pr'],
        rows: [[global.master, global.pr]]
      }
    },

    ...listToMarkdownTable(
      ':clap: Congratulations, your PR fixes TypeScript problems for the files below',
      fixedList
    ),

    ...listToMarkdownTable(
      ':muscle: Nice job, your PR reduce TypeScript problems for the files below',
      decreasedList
    ),

    ...listToMarkdownTable(
      ':stop_sign: Beware, your PR introduce new TypeScript problems for the files below',
      openedList
    ),

    ...listToMarkdownTable(
      ':warning: Ooops, your PR increase TypeScript problems for the files below',
      increasedList
    ),

    ...mapToMarkdownTable(increasedDetails)
  ])
}
