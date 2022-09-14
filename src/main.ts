import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'

import comparator from './comparator'

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', {required: true})
    const github = getOctokit(token)

    const markdown = await comparator({
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

    const response = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number
    })

    const comments = response.status === 200 ? response.data : []

    await Promise.all(
      comments.map(async comment => {
        if (comment.user?.login === 'github-actions[bot]') {
          return github.rest.issues.deleteComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            comment_id: comment.id
          })
        }
        return Promise.resolve(null)
      })
    )

    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: markdown
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
