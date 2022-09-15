import {context, getOctokit} from '@actions/github'

export const isGithubBotComment = (comment: {
  user?: {login: string} | null
}): boolean => comment.user?.login === 'github-actions[bot]'

export const createOrReplaceGithubBotComment = async (
  githubClient: ReturnType<typeof getOctokit>,
  message: string
): Promise<void> => {
  const contextArgs = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number
  }

  const response = await githubClient.rest.issues.listComments(contextArgs)
  const comments = response.status === 200 ? response.data : []

  const lastGithubBotComment = comments.find(comment =>
    isGithubBotComment(comment)
  )
  if (lastGithubBotComment) {
    await githubClient.rest.issues.deleteComment({
      ...contextArgs,
      comment_id: lastGithubBotComment.id
    })
  }

  await githubClient.rest.issues.createComment({
    ...contextArgs,
    body: message
  })
}
