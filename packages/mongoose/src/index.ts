import * as mongoose from 'mongoose'
import { parseArgs } from 'util'
import { start, mongod } from 'common'
import { benchmark, benchmarkAutopopulate } from './benchmark.js'

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
  mongoose.connect(mongod.getUri())

  await start('mongoose (populate method)', benchmark, {
    instance: mongoose,
    iterations: Number(opts.iterations),
  })

  await start('mongoose (autopopulate)', benchmarkAutopopulate, {
    instance: mongoose,
    iterations: Number(opts.iterations),
  })

  await mongod.stop()
  process.exit(0)
}

main()

