import type { CollectionName } from './benchmark.js'
import { defineCollection, insert, get, getAll, type Collection } from 'aeria'

const pet = defineCollection({
  description: {
    $id: 'pet',
    timestamps: false,
    properties: {
      name: {
        type: 'string',
      },
    },
  },
  functions: {
    insert,
  },
})

const person = defineCollection({
  description: {
    $id: 'person',
    timestamps: false,
    properties: {
      name: {
        type: 'string',
      },
      pet: {
        $ref: 'pet',
        inline: true,
      },
    },
  },
  functions: {
    insert,
  },
})

const norefs = defineCollection({
  description: {
    $id: 'norefs',
    timestamps: false,
    properties: {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    },
  },
  functions: {
    insert,
    get,
    getAll,
  },
})

const plain = defineCollection({
  description: {
    $id: 'plain',
    timestamps: false,
    properties: {
      name: {
        type: 'string',
      },
      pet: {
        $ref: 'pet',
        inline: true,
      },
    },
  },
  functions: {
    insert,
    get,
    getAll,
  },
})

const deep = defineCollection({
  description: {
    $id: 'deep',
    timestamps: false,
    properties: {
      name: {
        type: 'string',
      },
      person: {
        $ref: 'person',
        inline: true,
      },
    },
  },
  functions: {
    insert,
    get,
    getAll,
  },
})

const collections = ({
  pet,
  person,
  norefs,
  plain,
  deep,
} as const) satisfies Record<CollectionName, Omit<Collection, 'item'>>

export {
  collections,
}

