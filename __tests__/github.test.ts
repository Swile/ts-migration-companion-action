import {isGithubBotComment} from '../src/github'

describe('Github', () => {
  describe('#isGithubBotComment', () => {
    it('should return true if comment is from a github bot', () => {
      expect(isGithubBotComment({user: {login: 'github-actions[bot]'}})).toBe(
        true
      )
    })

    it('should return false if comment is not from a github bot', () => {
      expect(isGithubBotComment({})).toBe(false)
      expect(isGithubBotComment({user: null})).toBe(false)
      expect(isGithubBotComment({user: {login: 'johndoe'}})).toBe(false)
    })
  })

  describe('#createOrReplaceGithubBotComment', () => {
    const context = {
      repo: {owner: 'repo/owner', repo: 'repo/repo'},
      issue: {number: 42}
    }

    const getMockedModule = () => {
      jest.mock('@actions/github', () => ({
        getOctokit: () => ({
          rest: {
            issues: {
              listComments: jest.fn(),
              deleteComment: jest.fn(),
              createComment: jest.fn()
            }
          }
        }),
        context
      }))

      const {getOctokit} = require('@actions/github')

      return {github: getOctokit(), module: require('../src/github')}
    }

    beforeAll(async () => {
      jest.resetModules()
      jest.resetAllMocks()
    })

    it('should retrieve PR comments and remove last from github bot if exist', async () => {
      const {github, module} = getMockedModule()

      jest.spyOn(github.rest.issues, 'listComments').mockResolvedValue({
        status: 200,
        data: [
          {
            user: {login: 'github-actions[bot]'},
            id: 42
          }
        ]
      })

      await module.createOrReplaceGithubBotComment(github, 'foobar')

      expect(github.rest.issues.listComments).toHaveBeenCalledWith({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo
      })

      expect(github.rest.issues.deleteComment).toHaveBeenCalledWith({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: 42
      })
    })

    it("should don't remove last github bot comment if not exists", async () => {
      const {github, module} = getMockedModule()

      jest.spyOn(github.rest.issues, 'listComments').mockResolvedValue({
        status: 200,
        data: []
      })

      await module.createOrReplaceGithubBotComment(github, 'foobar')

      expect(github.rest.issues.listComments).toHaveBeenCalledWith({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo
      })

      expect(github.rest.issues.deleteComment).not.toHaveBeenCalled()
    })

    it("should don't remove last github bot comment if not response status is not 200", async () => {
      const {github, module} = getMockedModule()

      jest.spyOn(github.rest.issues, 'listComments').mockResolvedValue({
        status: 500,
        data: [
          {
            user: {login: 'github-actions[bot]'},
            id: 42
          }
        ]
      })

      await module.createOrReplaceGithubBotComment(github, 'foobar')

      expect(github.rest.issues.listComments).toHaveBeenCalledWith({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo
      })

      expect(github.rest.issues.deleteComment).not.toHaveBeenCalled()
    })

    it('should create a new comment using github bot', async () => {
      const {github, module} = getMockedModule()

      jest.spyOn(github.rest.issues, 'listComments').mockResolvedValue({
        status: 200,
        data: []
      })

      await module.createOrReplaceGithubBotComment(github, 'foobar')

      expect(github.rest.issues.createComment).toHaveBeenCalledWith({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: 'foobar'
      })
    })
  })
})
