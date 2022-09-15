import {normalizeFilepath, parseErrorLine, parseTscOutput} from '../src/parser'

const output = `
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
src/api/v0/serializers/utils/serialize-types.js(23,44): error TS2554: Expected 0 arguments, but got 1.`

describe('Parser', () => {
  describe('#normalizeFilepath', () => {
    it('should return basepath and file extension from filepath', () => {
      expect(
        normalizeFilepath('src/api/v0/serializers/utils/serialize-types.js')
      ).toEqual({
        basepath: 'src/api/v0/serializers/utils/serialize-types',
        extension: '.js'
      })
    })
  })

  describe('#parseErrorLine', () => {
    it('should extract informations from error line', () => {
      expect(parseErrorLine(output.split('\n')[1])).toEqual({
        basepath: 'src/api/v0/serializers/utils/serialize-types',
        code: 'TS7006',
        error: "TS7006: Parameter 'value' implicitly has an 'any' type.",
        extension: '.js',
        message: "Parameter 'value' implicitly has an 'any' type.",
        position: '4,26'
      })
    })
  })

  describe('#parseTscOutput', () => {
    it('correctly parse tsc output', () => {
      const ast = parseTscOutput(output, ['src'])
      expect(ast).toMatchSnapshot()
    })
  })
})
