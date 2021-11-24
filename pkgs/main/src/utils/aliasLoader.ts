import { readdir } from 'fs-extra'

export const aliasLoader = (args: { from: RegExp; to: string }) => {
  return {
    name: 'alias-loader:' + args.to,
    setup: (buildResult) => {
      buildResult.onResolve({ filter: args.from }, async (e) => {
        if (args.to.indexOf('*') > 0) {
          let arr = args.to.split('/')
          let path: string[] = []
          for (let i of arr) {
            let resolved = i
            if (i.indexOf('*') >= 0) {
              const rp = wildcardToRegExp(i)
              for (let file of await readdir(path.join('/'))) {
                if (rp.test(file)) {
                  resolved = file
                }
              }
            }

            path.push(resolved)
          }
          args.to = path.join('/')
        }

        return {
          path: args.to,
        }
      })
    },
  }
}

function wildcardToRegExp(s) {
  return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$')
}
function regExpEscape(s) {
  return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}
