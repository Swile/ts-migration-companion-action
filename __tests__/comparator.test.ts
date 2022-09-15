import comparator from '../src/comparator'
import * as reader from '../src/reader'

const moreErrors = `
src/api/v0/serializers/utils/serialize-types.js(4,26): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/api/v0/serializers/utils/serialize-types.js(17,33): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '<T>(obj: T) => Pick<T, Exclude<keyof T, Exclude<keyof T, string | number | symbol>>>' is not assignable to parameter of type '(x0: any, x1: any, x2: any) => readonly any[]'.
      Type 'Pick<any, string | number | symbol>' is missing the following properties from type 'readonly any[]': length, concat, join, slice, and 18 more.
src/api/v0/serializers/utils/serialize-types.js(17,46): error TS2554: Expected 0 arguments, but got 1.
src/api/v0/serializers/utils/serialize-types.js(20,24): error TS7006: Parameter 'date' implicitly has an 'any' type.
src/api/v0/serializers/utils/serialize-types.js(23,31): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '<T>(obj: T) => Pick<T, Exclude<keyof T, Exclude<keyof T, string | number | symbol>>>' is not assignable to parameter of type '(x0: any, x1: any, x2: any) => readonly any[]'.
src/api/v0/serializers/utils/serialize-types.js(23,44): error TS2554: Expected 0 arguments, but got 1.
`

const lessErrors = `
src/api/v0/serializers/utils/serialize-types.js(4,26): error TS7006: Parameter 'value' implicitly has an 'any' type.
src/api/v0/serializers/utils/serialize-types.js(17,33): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '<T>(obj: T) => Pick<T, Exclude<keyof T, Exclude<keyof T, string | number | symbol>>>' is not assignable to parameter of type '(x0: any, x1: any, x2: any) => readonly any[]'.
      Type 'Pick<any, string | number | symbol>' is missing the following properties from type 'readonly any[]': length, concat, join, slice, and 18 more.
`

describe('Comparator', () => {
  it('should return the right markdown comparison when PR improve errors', async () => {
    jest
      .spyOn(reader, 'readTscOutputByFilepath')
      .mockImplementation(async (filepath: string): Promise<string> => {
        if (filepath === '/fake/path/to/master.txt') {
          return moreErrors
        }

        return lessErrors
      })

    expect(
      await comparator({
        masterTscOutputPath: '/fake/path/to/master.txt',
        prTscOutputPath: '/fake/path/to/pr.txt',
        tscRootDir: 'src'
      })
    ).toMatchSnapshot()
  })

  it('should return the right markdown comparison when PR add errors', async () => {
    jest
      .spyOn(reader, 'readTscOutputByFilepath')
      .mockImplementation(async (filepath: string): Promise<string> => {
        if (filepath === '/fake/path/to/master.txt') {
          return lessErrors
        }

        return moreErrors
      })

    expect(
      await comparator({
        masterTscOutputPath: '/fake/path/to/master.txt',
        prTscOutputPath: '/fake/path/to/pr.txt',
        tscRootDir: 'src'
      })
    ).toMatchSnapshot()
  })

  it('should return an empty comparison table if tscRootDir is not right', async () => {
    jest
      .spyOn(reader, 'readTscOutputByFilepath')
      .mockImplementation(async (filepath: string): Promise<string> => {
        if (filepath === '/fake/path/to/master.txt') {
          return lessErrors
        }

        return moreErrors
      })

    expect(
      await comparator({
        masterTscOutputPath: '/fake/path/to/master.txt',
        prTscOutputPath: '/fake/path/to/pr.txt',
        tscRootDir: 'badRoot'
      })
    ).toMatchSnapshot()
  })
})
