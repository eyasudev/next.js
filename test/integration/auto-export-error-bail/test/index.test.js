/* eslint-env jest */

import path from 'path'
import fs from 'fs-extra'
import { nextBuild } from 'next-test-utils'

jest.setTimeout(1000 * 60 * 1)
const appDir = path.join(__dirname, '..')
const nextConfig = path.join(appDir, 'next.config.js')

const runTests = () => {
  it('should not opt-out of auto static optimization from invalid _error', async () => {
    const output = await nextBuild(appDir, undefined, {
      stdout: true,
      stderr: true,
    })

    if (output.code) {
      console.log(output)
    }

    expect(output.code).toBe(0)
    expect(output.stderr + output.stdout).not.toContain(
      'You have opted-out of Automatic Static Optimization due to'
    )
  })
}

describe('Auto Export _error bail', () => {
  describe('server mode', () => {
    runTests()
  })

  describe('serverless mode', () => {
    beforeAll(() =>
      fs.writeFile(
        nextConfig,
        `
      module.exports = {
        target: 'experimental-serverless-trace'
      }
    `
      )
    )
    afterAll(() => fs.remove(nextConfig))

    runTests()
  })
})
