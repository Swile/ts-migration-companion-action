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

  await Promise.all(
    comments.map(async comment => {
      if (isGithubBotComment(comment)) {
        return githubClient.rest.issues.deleteComment({
          ...contextArgs,
          comment_id: comment.id
        })
      }
      return Promise.resolve(null)
    })
  )

  await githubClient.rest.issues.createComment({
    ...contextArgs,
    body: message
  })
}
