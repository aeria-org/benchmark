import type { WithId } from 'mongodb'
import type { Benchmark } from 'common'
import { ObjectId } from 'mongodb'
import { prismaMongod, fixtures } from 'common'
import { PrismaClient } from '@prisma/client'

type FindOneFn = (_filters: unknown)=> Promise<WithId<unknown> | null>

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: prismaMongod.getUri('prisma'),
    },
  },
})

export const benchmark: Benchmark<null> = {
  createFixtures: async () => {
    const pet1 = await prisma.pet.create({
      data: fixtures.pet(),
    })

    const personFixture = fixtures.person(pet1.id)
    const person1 = await prisma.person.create({
      data: {
        name: personFixture.name,
        pet: {
          connect: {
            id: pet1.id,
          },
        },
      },
    })

    const norefs = await prisma.norefs.create({
      data: fixtures.norefs(),
    })

    const plainFixture = fixtures.plain(pet1.id)
    const plain = await prisma.plain.create({
      data: {
        name: plainFixture.name,
        pet: {
          connect: {
            id: pet1.id,
          },
        },
      },
    })

    const deepFixture = fixtures.deep(pet1.id)
    const deep = await prisma.deep.create({
      data: {
        name: deepFixture.name,
        person: {
          connect: {
            id: person1.id,
          },
        },
      },
    })

    return {
      norefs: {
        _id: new ObjectId(norefs.id),
      },
      plain: {
        _id: new ObjectId(plain.id),
      },
      deep: {
        _id: new ObjectId(deep.id),
      },
    }
  },
  get: async (benchmarkCase, _id) => {
    let include = {}
    switch( benchmarkCase ) {
      case 'plain': include = {
        pet: true,
      }
        break
      case 'deep': include = {
        person: {
          include: {
            pet: true,
          },
        },
      }
        break
    }

    const doc = await (prisma[benchmarkCase].findFirst as FindOneFn)({
      where: {
        id: _id,
      },
      include,
    })

    if( !doc ) {
      throw new Error
    }

    return doc
  },
}

