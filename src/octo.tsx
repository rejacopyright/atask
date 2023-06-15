import { Octokit } from '@octokit/core'

const octokit = new Octokit({
  auth: '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',
})

interface Params {
  q: string | undefined
  page?: number
  per_page?: number
  type?: 'all' | 'owner' | 'member'
}

export default async (url: string, params: Params) =>
  octokit.request(`GET /${url}`, {
    ...params,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
