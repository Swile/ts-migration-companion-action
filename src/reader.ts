import fs from 'node:fs/promises'

export async function readTscOutputByFilepath(
  filepath: string
): Promise<string> {
  return await fs.readFile(filepath, {encoding: 'utf8'})
}
