import * as core from '@actions/core'
import {getActionInputs} from '../src/main'

jest.mock('../src/comparator')

describe('Main', () => {
  describe('#getActionInputs', () => {
    it('should retrieve github action inputs', () => {
      jest.spyOn(core, 'getInput').mockImplementation((name: string) => name)

      expect(getActionInputs()).toEqual({
        token: 'github-token',
        masterTscOutputPath: 'master_tsc_output_path',
        prTscOutputPath: 'pr_tsc_output_path',
        tscRootDir: 'tsc_rootdir'
      })
    })
  })
})
