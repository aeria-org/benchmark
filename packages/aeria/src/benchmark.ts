import type { RouteContext } from 'aeria'
import type { Benchmark } from 'common'
import { createContext, throwIfError, get } from 'aeria'
import { fixtures } from 'common'

export const benchmark: Benchmark<RouteContext> = {
  createFixtures: async (context) => {
    const pet1 = throwIfError(await context.collections.pet.functions.insert({
      what: fixtures.pet(),
    }))
    const person1 = throwIfError(await context.collections.person.functions.insert({
      what: fixtures.person(pet1._id),
    }))

    const norefs = throwIfError(await context.collections.norefs.functions.insert({
      what: fixtures.norefs(),
    }))
    const plain = throwIfError(await context.collections.plain.functions.insert({
      what: fixtures.plain(pet1._id),
    }))
    const deep = throwIfError(await context.collections.deep.functions.insert({
      what: fixtures.deep(person1._id),
    }))

    return {
      norefs,
      plain,
      deep,
    }
  },
  get: async (benchmarkCase, _id, parentContext) => {
    const context = await createContext({
      parentContext,
      collectionName: benchmarkCase,
    })

    return throwIfError(await get({
      filters: {
        _id,
      },
    }, context))
  },
}

export const benchmarkBypassSecurity: Benchmark<RouteContext> = {
  ...benchmark,
  get: async (benchmarkCase, _id, parentContext) => {
    const context = await createContext({
      parentContext,
      collectionName: benchmarkCase,
    })

    return throwIfError(await get({
      filters: {
        _id,
      },
    }, context, {
      bypassSecurity: true,
    }))
  },
}
