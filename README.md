# 🕵️‍♂️ ts-migration-companion-action

The goal of this tool is to benefits from a system that we can use to track the TypeScript migration progress. 

The tool prints the current progress status between the current pull request branch and the master branch.

It'll:
- Gives the global error count for master and the pull request
- Gives a message that tell you if the PR is increasing or decreasing errors
- List an error summary table for each errored file

## Usage

```
name: TS Migration Companion

on:
  pull_request:
    branches:
      - master

permissions:                                                # Required permissions to work
      contents: read
      packages: read
      pull-requests: write
      issues: write

jobs:
  typescript-migration-companion:
    runs-on: ubuntu-latest
    steps:
      - name: Create tsc-output directory                   # create a tmp directory 
        run: mkdir /tmp/tsc-output
      - name: Checkout main branch                          # checkout master branch
        uses: actions/checkout@v3
        with:
          clean: false
          ref: main
      - name: Run npm install on main branch                # install master branch deps 
        run: npm ci
      - name: Typecheck dependencies on main branch         # run tsc and store output in file
        run: npm run build > /tmp/tsc-output/main.txt
        continue-on-error: true
      - name: Checkout PR branch                            # checkout pr branch
        uses: actions/checkout@v3
      - name: Run npm install on PR branch                  # install pr branch deps
        run: npm ci
      - name: Typecheck dependencies on pr branch           # run tsc and store output in file
        run: npm run build > /tmp/tsc-output/pr.txt
        continue-on-error: true
      - uses: swile/ts-migration-companion-action           # run ts-migration-companion
        with:
          master_tsc_output_path: /tmp/tsc-output/main.txt  # configure "master" branch output file path
          pr_tsc_output_path: /tmp/tsc-output/pr.txt        # configure "pr" branch output file path
          tsc_rootdir: src                                  # configure source "rootdir" to analyze (usually src)
```

## License

ts-migration-companion-action is available under the MIT license. See the LICENSE file for more info.