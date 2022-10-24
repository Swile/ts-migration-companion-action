<div align="center">
  <h1>🕵️‍♂️ <code>ts-migration-companion-action</code></h1>
</div>

The goal of this tool is to benefit from a system enabling to track the progress of your journey to migrate a codebase from JavaScript to TypeScript. 

The tool prints the current progress status between the current pull request source branch and the main branch of your project.

It'll:
- Give the global error count for the main branch and the pull request source branch
- Give a message that tell you if the pull request is increasing or decreasing the errors count
- List an error summary table for each errored file as a comment in the pull request

## 👨‍💻 Getting started

Let's see how to configure the `ts-migration-companion-action` in your project.

1. First, create a `.github/workflows/pr.yml` file if you don't already have one
2. Add a `name` section corresponding to the name you want to set to your new GitHub action:
    ```yml
    name: TS Migration Companion
    ```
3. Below, you have to configure the events for which the action has to be triggered. 
   In our example here, we want the GitHub action to be triggered everytime we open a pull request targeting the `master` branch which is our main branch:
    ```yml
    on:
      pull_request:
        branches:
          - master
    ```
4. Then, you have to grant the action some permissions, so that it can read your project files, write comments in pull requests and issues:
    ```yml
    permissions:
      contents: read
      packages: read
      pull-requests: write
      issues: write
    ```
5. The next step consists in defining the jobs run by the action to compute the TypeScript errors on your feature branch, on the main branch (`master` here), and create a report that will be published as a comment in your pull request.
   Here is how to configure those steps:
   1. Create a `job` section, give it a name and define the runtime OS. You must also initiate a `step` list as follows:
      ```yml
      jobs:
        typescript-migration-companion:
          runs-on: ubuntu-latest
        steps:
      ```
   2. Define the first step to create a directory in which the TypeScript compiler (`tsc`) output files will be created:
      ```yml
      - name: Create tsc-output directory
        run: mkdir /tmp/tsc-output
      ```
   3. Then, we need to checkout on the main branch of our repository (`master` in the example):
      ```yml
      - name: Checkout main branch
        uses: actions/checkout@v3
        with:
          clean: false
          ref: master
      ```
   4. On this main branch, we have to install the Node.js dependencies. You can use whatever package manager you like, such as `yarn`, `npm`, etc. 
      In our example, we have a `ci` script which installs the dependencies as follows:
      ```yml
      - name: Run npm install on main branch
        run: npm ci
      ```
   5. Then, we can run the type checking on the main branch, and persist the output in a text file in the previously created folder. 
   In our example, we have a `build` script which execute a `tsc` directly, so we can use:
      ```yml
      - name: Typecheck dependencies on main branch
        run: npm run build > /tmp/tsc-output/main.txt
        continue-on-error: true
      ```
   6. We now have to do the same for the branch related to the pull request. 
      Let's add the three following steps:
      ```yml
      - name: Checkout PR branch
        uses: actions/checkout@v3
        
      - name: Run npm install on PR branch
        run: npm ci

      - name: Typecheck dependencies on PR branch
        run: npm run build > /tmp/tsc-output/pr.txt
        continue-on-error: true
      ```
    7. Finally, we have to define a last step using the `swile/ts-migration-companion-action` tool to compare both type checking outputs (from the main branch and the one specific to the pull request branch), create a report and post it as a comment in your pull request. 
    You must provide:
         - `master_tsc_output_path`: the path to the type check output for the main branch
         - `pr_tsc_output_path`: the path to the type check output for the source branch of the pull request
         - `tsc_rootdir`: the path to the root folder containing the source code (usually `src`)
  
    This gives us the final step as follows:
      ```yml
      - uses: swile/ts-migration-companion-action
        with:
          master_tsc_output_path: /tmp/tsc-output/main.txt
          pr_tsc_output_path: /tmp/tsc-output/pr.txt
          tsc_rootdir: src
      ```

## 💨 Summary

Here is a global example on a GitHub action enabling to use the `ts-migration-companion-action` tool.

```yml
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
      - name: Create tsc-output directory                   # Create a `tmp` directory 
        run: mkdir /tmp/tsc-output

      - name: Checkout main branch                          # Checkout the `main` branch
        uses: actions/checkout@v3
        with:
          clean: false
          ref: master

      - name: Run npm install on main branch                # Install the deps on the `main` branch 
        run: npm ci

      - name: Typecheck dependencies on main branch         # Run `tsc` and store output in file
        run: npm run build > /tmp/tsc-output/main.txt
        continue-on-error: true

      - name: Checkout PR branch                            # Checkout PR source branch
        uses: actions/checkout@v3
        
      - name: Run npm install on PR branch                  # Install the deps on the PR branch
        run: npm ci

      - name: Typecheck dependencies on PR branch           # Run `tsc` and store output in file
        run: npm run build > /tmp/tsc-output/pr.txt
        continue-on-error: true

      - uses: swile/ts-migration-companion-action           # Run the `ts-migration-companion` tool
        with:
          master_tsc_output_path: /tmp/tsc-output/main.txt  # Configure the path to the main branch output file
          pr_tsc_output_path: /tmp/tsc-output/pr.txt        # Configure the path to the PR source branch output file
          tsc_rootdir: src                                  # Configure source root directory to analyze (usually `src`)
```

## 🧑‍⚖️ License

`ts-migration-companion-action` is available under the MIT license. See the [`LICENSE`](./LICENSE) file for more info.