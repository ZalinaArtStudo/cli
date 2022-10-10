/* eslint-disable no-console */
import {validateProject, fillDeployConfig} from './config.js'
import {gitInit} from '../../prompts/git-init.js'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import {error, file, git} from '@shopify/cli-kit'

const defaultConfig = {
  deploymentToken: 'abcdefg',
  oxygenAddress: 'https://integration.test',
  healthCheck: true,
  assumeYes: true,
}

describe('validateProject() & initializeGit()', () => {
  describe('User refuses to initialize new repository', () => {
    it('silent abort since outside git directory', async () => {
      await file.inTemporaryDirectory(async (tmpDir) => {
        vi.mock('../../prompts/git-init.js')
        vi.mocked(gitInit).mockResolvedValue(false)

        await expect(() => validateProject({...defaultConfig, assumeYes: false, path: tmpDir})).rejects.toThrow(
          new error.AbortSilent(),
        )
      })
    })
  })
  describe('User accepts to initialize new repository', () => {
    it(
      'initializes new git repository',
      async () => {
        await file.inTemporaryDirectory(async (tmpDir) => {
          console.log('Waiting for touching integration file')
          await file.touch(`${tmpDir}/integration.txt`)

          console.log('Waiting for validate project')
          await validateProject({...defaultConfig, path: tmpDir})

          console.log('Waiting for .gitignore exists')
          await expect(file.exists(`${tmpDir}/.gitignore`)).resolves.toBeTruthy()
          console.log('Waiting for getLastestCommit')
          await expect(git.getLatestCommit(tmpDir)).resolves.toBeDefined()
        })
      },
      10 * 1000,
    )
  })
})

describe('getDeployConfig()', () => {
  it(
    'extract basic information from git',
    async () => {
      await file.inTemporaryDirectory(async (tmpDir) => {
        console.log('Waiting for validate project in basic info')
        await validateProject({...defaultConfig, path: tmpDir})

        console.log('Waiting for fillDeployConfig')
        const config = await fillDeployConfig({...defaultConfig, path: tmpDir})

        expect(config.commitMessage).toBe('Initial commit generated by Hydrogen')
        expect(config.commitRef).toBe(`refs/heads/main`)
        expect(config.deploymentToken).toBe(defaultConfig.deploymentToken)
        expect(config.oxygenAddress).toBe(defaultConfig.oxygenAddress)
        expect(config.healthCheck).toBe(defaultConfig.healthCheck)
        expect(config.path).toBe(tmpDir)
        expect(new Date(config.timestamp).getTime()).toBeLessThan(new Date().getTime())
        // Can't test config.commitAuthor & config.commitSha. The integration test can be run anywhere and
        // these properties would cause flakiness. The commit author could or couldn't be set and there is
        // no clear fallback like for default branch.
      })
    },
    10 * 1000,
  )
})
