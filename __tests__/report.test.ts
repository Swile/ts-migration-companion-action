import {getMarkdownReportComparator} from '../src/report'

describe('Report', () => {
  describe('#getMarkdownReportComparator', () => {
    it('should return the right markdown text from report', async () => {
      expect(
        await getMarkdownReportComparator({
          global: {master: 42, pr: 24},
          decreasedList: [
            {
              basepath: '/path/to/file1.ts',
              master: 10,
              pr: 9
            },
            {
              basepath: '/path/to/file2.ts',
              master: 3,
              pr: 2
            }
          ],
          fixedList: [
            {
              basepath: '/path/to/file3.ts',
              master: 10,
              pr: 9
            },
            {
              basepath: '/path/to/file4.ts',
              master: 3,
              pr: 2
            }
          ],
          increasedDetails: new Map(),
          increasedList: [
            {
              basepath: '/path/to/file5.ts',
              master: 10,
              pr: 11
            },
            {
              basepath: '/path/to/file6.ts',
              master: 3,
              pr: 4
            }
          ],
          openedList: [
            {
              basepath: '/path/to/file7.ts',
              master: 10,
              pr: 11
            },
            {
              basepath: '/path/to/file8.ts',
              master: 3,
              pr: 4
            }
          ]
        })
      ).toMatchSnapshot()
    })
  })
})
