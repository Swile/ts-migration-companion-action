import * as core from '@actions/core'
import {getOctokit} from '@actions/github'

import comparator from './comparator'
import {createOrReplaceGithubBotComment} from './github'

export const getActionInputs = (): {
  token: string
  masterTscOutputPath: string
  prTscOutputPath: string
  tscRootDir: string
} => ({
  token: core.getInput('github-token', {required: true}),
  masterTscOutputPath: core.getInput('master_tsc_output_path', {
    required: true,
    trimWhitespace: true
  }),
  prTscOutputPath: core.getInput('pr_tsc_output_path', {
    required: true,
    trimWhitespace: true
  }),
  tscRootDir: core.getInput('tsc_rootdir')
})

export async function run(): Promise<void> {
  try {
    const {token, ...comparatorOptions} = getActionInputs()

    const markdown = await comparator(comparatorOptions)

    const github = getOctokit(token)

    await createOrReplaceGithubBotComment(github, markdown)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

if (require.main === module) {
  run()
}
