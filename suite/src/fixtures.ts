import type { Schema, PackReferences } from 'aeria'
import type { CollectionName } from './benchmark.js'
import type { collections } from './collections.js'
import { ObjectId } from 'aeria'

const pet = (): Schema<typeof collections['pet']['description']> => {
  return {
    name: 'Thor',
  }
}

const person = (pet: ObjectId | string): PackReferences<Schema<typeof collections['person']['description']>> => {
  return {
    name: 'Thor',
    pet: new ObjectId(pet),
  }
}

const norefs = (): Schema<typeof collections['norefs']['description']> => {
  return {
    name: 'Terry',
    age: 50,
  }
}

const plain = (pet: ObjectId | string): PackReferences<Schema<typeof collections['plain']['description']>> => {
  return {
    name: 'Terry',
    pet: new ObjectId(pet),
  }
}

const deep = (person: ObjectId | string): PackReferences<Schema<typeof collections['deep']['description']>> => {
  return {
    name: 'Terry',
    person: new ObjectId(person),
  }
}

const fixtures = ({
  pet,
  person,
  norefs,
  plain,
  deep,
} as const) satisfies Record<CollectionName, unknown>

export {
  fixtures,
}

