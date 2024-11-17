import type { WithId, ObjectId } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'
import { performance } from 'perf_hooks'
import { MongoClient } from 'mongodb'
import { validateWithRefs } from 'aeria'
import { collections } from './collections.js'
import { mongod, RESULTS_FILE } from './index.js'

export type BenchmarkCase =
  | 'norefs'
  | 'plain'
  | 'deep'

export type CollectionName =
  | BenchmarkCase
  | 'pet'
  | 'person'

export type BenchmarkFixtures = Record<BenchmarkCase, WithId<unknown>>

export type Benchmark<TInstance> = {
  createFixtures: (_instance: TInstance)=> Promise<Record<BenchmarkCase, WithId<unknown>>>
  get: (_benchmarkCase: BenchmarkCase, _id: ObjectId, _instance: TInstance)=> Promise<WithId<unknown>>
}

export type BenchmarkOptions<TInstance> = {
  instance: TInstance
  iterations: number
}

export const runBenchmark = async <TInstance>(
  benchmarkCase: BenchmarkCase,
  benchmark: Benchmark<TInstance>,
  fixtures: BenchmarkFixtures,
  { instance, iterations }: BenchmarkOptions<TInstance>,
) => {
  const startTime = performance.now()
  const { [benchmarkCase]: { _id: docId } } = fixtures
  const doc = await benchmark.get(benchmarkCase, docId, instance)

  const { error } = await validateWithRefs(doc, collections[benchmarkCase].description, {
    tolerateExtraneous: true,
  }, {
    pet: collections.pet.description,
    person: collections.person.description,
  })

  if( error ) {
    console.error(JSON.stringify(doc, null, 2))
    console.error(JSON.stringify(error, null, 2))
    throw new Error
  }
  for( let i = 0; i < iterations; i++ ) {
    const doc = await benchmark.get(benchmarkCase, docId, instance)
    if( process.env.NODE_ENV === 'debug' ) {
      console.log(doc)
    }
  }

  return Math.round(performance.now() - startTime)
}

export type ResultsData = {
  mongodbVersion: string
  results: Record<string, Record<BenchmarkCase, number>>
}

export const start = async <TInstance>(name: string, benchmark: Benchmark<TInstance>, options: BenchmarkOptions<TInstance>) => {
  const client = new MongoClient(mongod.getUri())
  await client.db().dropDatabase()
  const { version: mongodbVersion } = await client.db('admin').admin().serverStatus()

  const fixtures = await benchmark.createFixtures(options.instance)

  await fs.promises.mkdir(path.dirname(RESULTS_FILE), {
    recursive: true,
  })

  try {
    const results = {
      norefs: await runBenchmark('norefs', benchmark, fixtures, options),
      plain: await runBenchmark('plain', benchmark, fixtures, options),
      deep: await runBenchmark('deep', benchmark, fixtures, options),
    }

    console.log({
      name,
      mongodbVersion,
      results,
    })

    if( fs.existsSync(RESULTS_FILE) ) {
      const content = await fs.promises.readFile(RESULTS_FILE, {
        encoding: 'utf-8',
      })

      const data: ResultsData = JSON.parse(content)
      data.results[name] = results

      await fs.promises.writeFile(RESULTS_FILE, JSON.stringify(data, null, 2))

    } else {
      await fs.promises.writeFile(RESULTS_FILE, JSON.stringify({
        mongodbVersion,
        results: {
          [name]: results,
        },
      }, null, 2))
    }
  } catch( err ) {
    console.trace(err)
    process.exit(1)
  }

}

