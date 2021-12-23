import pad from 'lodash.padend'
import { dbAdd } from './db-add'

export const dbIndex = async (args: string[]) => {
  const commands = {
    add: {
      desc: 'Add new additional database',
      func: dbAdd,
    },
    pull: {
      desc: 'Update current schema from database',
      func: async () => {},
    },
    generate: {
      desc: 'Generate typings from current schema',
      func: async () => {},
    },
  }
  if (args.length > 0) {
    commands[args[0]].func()
  } else {
    console.log(`\
node base db [command]

command are
${Object.keys(commands)
  .map((e) => {
    const item = commands[e]
    return `  ${pad(e, 10)}: ${item.desc}`
  })
  .join('\n')}
    `)
  }
}
