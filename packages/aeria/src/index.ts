import { init, createContext, getDatabase } from 'aeria'
import { parseArgs } from 'util'
import { start, mongod, collections } from 'common'
import { benchmark, benchmarkBypassSecurity } from './benchmark.js'

const { values: opts } = parseArgs({
  options: {
    run: {
      type: 'boolean',
      short: 'r',
    },
    iterations: {
      type: 'string',
      short: 'i',
      default: '1000',
    },
  },
})

export {
  collections,
}

export default init({
  config: {
    database: {
      mongodbUrl: mongod.getUri(),
    },
  },
})

const main = async () => {
  await getDatabase()
  const context = await createContext()

  await start('aeria (default)', benchmark, {
    instance: context,
    iterations: Number(opts.iterations),
  })

  await start('aeria (bypassSecurity)', benchmarkBypassSecurity, {
    instance: context,
    iterations: Number(opts.iterations),
  })

  await mongod.stop()
  process.exit(0)
}

if( opts.run ) {
  main()
}

