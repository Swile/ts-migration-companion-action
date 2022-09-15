import { type ParsedTsError } from './parser';
export interface TsReport {
    [basepath: string]: string[];
}
export interface TsErrorByFile {
    basepath: string;
    count: number;
}
export declare function getErrorByFileReport(ast: ParsedTsError[]): TsErrorByFile[];
