import fs from 'node:fs/promises'
import {readTscOutputByFilepath} from '../src/reader'

describe('Reader', () => {
  describe('#readTscOutputByFilepath', () => {
    it('should return file content from fs.readFile() using utf8 encoding', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValueOnce('foobar')

      expect(await readTscOutputByFilepath('/path/to/file.txt')).toBe('foobar')
      expect(fs.readFile).toHaveBeenCalledWith('/path/to/file.txt', {
        encoding: 'utf8'
      })
    })
  })
})
