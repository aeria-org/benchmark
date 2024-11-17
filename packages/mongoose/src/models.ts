import type { CollectionName } from 'common'
import * as mongoose from 'mongoose'
import { default as mongooseAutoPopulate } from 'mongoose-autopopulate'

const PetSchema = new mongoose.Schema({
  name: String,
})

const PersonSchema_ = (autopopulate = false) => new mongoose.Schema({
  name: String,
  pet: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: autopopulate
      ? 'pet_autopopulate'
      : 'pet',
    autopopulate: true,
  },
})

const PersonSchema = PersonSchema_()
PersonSchema.pre('findOne', function() {
  this.populate('pet')
})

const PersonSchemaAutopopulate = PersonSchema_(true)
PersonSchemaAutopopulate.plugin(mongooseAutoPopulate as any)

const NoRefsSchema = new mongoose.Schema({
  name: String,
  age: Number,
})

const PlainSchema_ = (autopopulate = false) => new mongoose.Schema({
  name: String,
  age: Number,
  pet: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: autopopulate
      ? 'pet_autopopulate'
      : 'pet',
    autopopulate: true,
  },
})

const PlainSchema = PlainSchema_(true)
PlainSchema.pre('findOne', function() {
  this.populate('pet')
})

const PlainSchemaAutopopulate = PlainSchema_()
PlainSchemaAutopopulate.plugin(mongooseAutoPopulate as any)

const DeepSchema_ = (autopopulate = false) => new mongoose.Schema({
  name: String,
  age: Number,
  person: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: autopopulate
      ? 'person_autopopulate'
      : 'person',
    autopopulate: true,
  },
})

const DeepSchema = DeepSchema_()
DeepSchema.pre('findOne', function() {
  this.populate({
    path: 'person',
    populate: {
      path: 'pet',
    },
  })
})

const DeepSchemaAutopopulate = DeepSchema_(true)
DeepSchemaAutopopulate.plugin(mongooseAutoPopulate as any)

export const cases = {
  pet: mongoose.model('pet', PetSchema, 'mongoose_pet'),
  person: mongoose.model('person', PersonSchema, 'mongoose_person'),
  norefs: mongoose.model('norefs', NoRefsSchema, 'mongoose_norefs'),
  plain: mongoose.model('plain', PlainSchema, 'mongoose_plain'),
  deep: mongoose.model('deep', DeepSchema, 'mongoose_deep'),
} satisfies Record<CollectionName, unknown>

export const casesAutopopulate = {
  pet: mongoose.model('pet_autopopulate', PetSchema, 'mongoose_pet'),
  person: mongoose.model('person_autopopulate', PersonSchemaAutopopulate, 'mongoose_person'),
  norefs: mongoose.model('norefs_autopopulate', NoRefsSchema, 'mongoose_norefs'),
  plain: mongoose.model('plain_autopopulate', PlainSchemaAutopopulate, 'mongoose_plain'),
  deep: mongoose.model('deep_autopopulate', DeepSchemaAutopopulate, 'mongoose_deep'),
} satisfies Record<CollectionName, unknown>

