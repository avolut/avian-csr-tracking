import fs from 'fs'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import { copy, pathExists, readdir, remove } from 'libs/fs'
import { tmpdir } from 'os'
import { join } from 'path'
import prompt from 'prompt'
import { dirs, log } from '../main'

export const basePush = async (arg: string[]) => {
  log('base', 'Requesting credentials...')

  const { username, password, msg } = await getGitUserPass(
    (await getCommitMsg(arg)).trim().replace(/(\r\n|\n|\r)/gm, '')
  )

  console.log('')
  const dir = join(tmpdir(), 'andro-base')
  if (await pathExists(dir)) {
    log('base', 'Cleaning base dir...')
    await remove(dir)
  }
  log('base', `tempdir: ${dir}`)
  log('base', 'Pulling base from bitbucket...')

  await git.clone({
    fs,
    http,
    url: 'https://bitbucket.org/andromedia/base',
    dir,
    depth: 1,
    onAuth: (url) => {
      return {
        username,
        password,
      }
    },
  })

  const files = [
    '.gitignore',
    'package.json',
    '.prettierrc',
    'pnpm-workspace.yaml',
  ]

  for (let [k, v] of Object.entries(dirs.pkgs)) {
    if (k !== 'web') {
      await copyPkgs(v, dir)
    } else {
      const webDirs = await readdir(v)
      for (let d of webDirs) {
        await copyPkgs(join(v, d), dir)
      }
    }
  }

  for (let i of files) {
    await copy(join(dirs.root, i), join(dir, i))
  }
}

const copyPkgs = async (dir: string, to: string) => {
  const subdir = dir.substring(join(dirs.root, 'pkgs').length)
  for (let i of await readdir(dir)) {
    if (i !== 'node_modules' && i !== 'build') {
      await copy(join(dir, i), join(to, 'pkgs', subdir, i))
    }
  }
}

const getGitUserPass = (msg: string) => {
  prompt.message = '  '
  prompt.delimiter = ''
  console.log('\nBitbucket login')
  return new Promise<{ username: string; password: string; msg: string }>(
    (resolve) => {
      prompt.get(
        [
          {
            name: 'username',
            description: '  Username:',
            required: true,
          },
          {
            name: 'password',
            description: '  Password:',
            hidden: true,
            conform: function (value) {
              return true
            },
          },
          {
            name: 'msg',
            default: msg,
            description: '  Commit Message:',
          },
        ],
        function (err, result) {
          resolve(result)
        }
      )
    }
  )
}

const getCommitMsg = async (arg: string[]) => {
  const lastCommit = await git.log({
    fs,
    dir: dirs.root,
    depth: 1,
  })

  let commitMsg = arg.slice(1).join('') || 'fix'
  if (lastCommit.length > 0) {
    commitMsg = lastCommit[0].commit.message
  }
  return commitMsg
}
