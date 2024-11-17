import { parseArgs } from 'util'
import { start, mongod } from 'common'
import { benchmark } from './benchmark.js'

const { values: opts } = parseArgs({
  options: {
    iterations: {
      type: 'string',
      short: 'i',
      default: '1000',
    },
  },
})

const main = async () => {
  await start('prisma', benchmark, {
    instance: null,
    iterations: Number(opts.iterations),
  })

  await mongod.stop()
  process.exit(0)
}

main()

