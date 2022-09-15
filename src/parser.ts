import path from 'node:path'

export function normalizeFilepath(filepath: string): {
  basepath: string
  extension: string
} {
  const extension = path.extname(filepath)
  const basepath = path.join(
    path.dirname(filepath),
    path.basename(filepath, extension)
  )
  return {
    basepath,
    extension
  }
}

export interface ParsedTsError {
  basepath: string
  extension: string
  position: string
  error: string
  code: string
  message: string
}

export function parseTscOutput(
  output: string,
  include: string[]
): ParsedTsError[] {
  const ast = output
    .split('\n')
    .filter(line => include.some(prefix => line.startsWith(prefix)))
    .map(parseErrorLine)

  return ast
}

export function parseErrorLine(line: string): ParsedTsError {
  const filepath = line.substring(0, line.indexOf('('))
  const position = line.substring(line.indexOf('(') + 1, line.indexOf(')'))
  const error = line.substring(line.indexOf(': error ') + ': error '.length)
  const code = error.substring(0, error.indexOf(': '))
  const message = error.substring(error.indexOf(': ') + 2)

  const {basepath, extension} = normalizeFilepath(filepath)

  return {basepath, extension, position, error, code, message}
}
