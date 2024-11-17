import type { WithId } from 'mongodb'
import type { Mongoose } from 'mongoose'
import type { Benchmark } from 'common'
import { fixtures } from 'common'
import { cases, casesAutopopulate } from './models.js'

type FindOneFn = (_filters: unknown)=> {
  lean: (_options?: { autopopulate: boolean })=> Promise<WithId<unknown> | null>
}

export const benchmark: Benchmark<Mongoose> = {
  createFixtures: async () => {
    const pet1 = await cases.pet.create(fixtures.pet())
    const person1 = await cases.person.create(fixtures.person(pet1._id))

    const norefs = await cases.norefs.create(fixtures.norefs())
    const plain = await cases.plain.create(fixtures.plain(pet1._id))
    const deep = await cases.deep.create(fixtures.deep(person1._id))

    return {
      norefs,
      plain,
      deep,
    }
  },
  get: async (benchmarkCase, _id) => {
    const doc = await (cases[benchmarkCase].findOne as FindOneFn)({
      _id,
    }).lean()

    if( !doc ) {
      throw new Error
    }

    return doc
  },
}

export const benchmarkAutopopulate: Benchmark<Mongoose> = {
  ...benchmark,
  get: async (benchmarkCase, _id) => {
    const doc = await (casesAutopopulate[benchmarkCase].findOne as FindOneFn)({
      _id,
    }).lean({
      autopopulate: true,
    })

    if( !doc ) {
      throw new Error
    }

    return doc
  },
}

