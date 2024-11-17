import { MongoMemoryServer, MongoMemoryReplSet } from 'mongodb-memory-server'
import { join } from 'path'
export * from './benchmark.js'
export * from './collections.js'
export * from './fixtures.js'

export const RESULTS_FILE = join('/tmp', 'mongo-benchmark-results', 'data.json')

export const mongod = await MongoMemoryServer.create()
export const prismaMongod = await MongoMemoryReplSet.create({
  replSet: {
    count: 2,
    dbName: 'prisma',
  },
})

