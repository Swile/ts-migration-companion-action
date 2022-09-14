import { TsErrorByFile } from './analyzer';
import { ParsedTsError } from './parser';
export interface MergedTsErrorByFile {
    basepath: TsErrorByFile['basepath'];
    master: number;
    pr: number;
}
interface ReportComparator {
    global: {
        master: number;
        pr: number;
    };
    openedList: MergedTsErrorByFile[];
    fixedList: MergedTsErrorByFile[];
    increasedList: MergedTsErrorByFile[];
    increasedDetails: Map<string, ParsedTsError[]>;
    decreasedList: MergedTsErrorByFile[];
}
export declare function getMarkdownReportComparator({ global, fixedList, openedList, increasedList, increasedDetails, decreasedList, }: ReportComparator): Promise<string>;
export {};
