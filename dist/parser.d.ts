export interface ParsedTsError {
    basepath: string;
    extension: string;
    position: string;
    error: string;
    code: string;
    message: string;
}
export declare function parseTscOutput(output: string, include: string[]): ParsedTsError[];
