"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarkdownReportComparator = void 0;
const json2md_1 = __importDefault(require("json2md"));
json2md_1.default.converters.details = ({ basepath, errors }, converter) => `
<details>
<summary>${basepath}</summary>
<p>

${converter([
    {
        table: {
            headers: ['position', 'error'],
            rows: [...errors.map((error) => [`${basepath}#L${error.position}`, error.message])],
        },
    },
])}

</p>
</details>
`;
function mapToMarkdownTable(map) {
    return map.size > 0
        ? [
            { h3: 'Details' },
            ...Array.from(map.entries()).map(([filepath, errors]) => ({
                details: {
                    filepath,
                    errors,
                },
            })),
        ]
        : [];
}
function listToMarkdownTable(title, errors) {
    return errors.length > 0
        ? [
            { h2: title },
            { h3: 'Summary' },
            {
                table: {
                    headers: ['filepath', 'master', 'pr'],
                    rows: errors.map(Object.values),
                },
            },
        ]
        : [];
}
async function getMarkdownReportComparator({ global, fixedList, openedList, increasedList, increasedDetails, decreasedList, }) {
    return (0, json2md_1.default)([
        { h1: 'TypeScript Migration Companion' },
        { h2: 'Global error infos' },
        {
            p: 'The table below compares the error count between the master branch and your pr. Produces `master > your PR` when you reduce TypeScript problems.',
        },
        {
            table: {
                headers: ['master', 'pr'],
                rows: [[global.master, global.pr]],
            },
        },
        ...listToMarkdownTable(':clap: Congratulations, your PR fixes TypeScript problems for the files below', fixedList),
        ...listToMarkdownTable(':muscle: Nice job, your PR reduce TypeScript problems for the files below', decreasedList),
        ...listToMarkdownTable(':stop_sign: Beware, your PR introduce new TypeScript problems for the files below', openedList),
        ...listToMarkdownTable(':warning: Ooops, your PR increase TypeScript problems for the files below', increasedList),
        ...mapToMarkdownTable(increasedDetails),
    ]);
}
exports.getMarkdownReportComparator = getMarkdownReportComparator;
//# sourceMappingURL=github.js.map