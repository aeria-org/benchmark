# MongoDB reference resolution benchmark

The goal of this repository is to benchmark reference resolution techniques used by MongoDB libraries.

The following libraries are tested:

- [Aeria](https://github.com/aeria-org/aeria) - leverages the Aggregation Framework to retrieve the deep populated document from the MongoDB backend using a single request
- [Mongoose](https://github.com/Automattic/mongoose) - makes multiple server requests and builds the final document using JS
- [Prisma](https://github.com/prisma/prisma) - makes multiple server requests and builds the final document using JS, just like Mongoose

[Click to view results](https://github.com/aeria-org/benchmark/blob/results/data.json)

### Method

Tests are ran in the default Github CI runner. First, a document is inserted for each case, then a loop retrieves it (`.findOne()`) N times. Finally, the time spend in each case is recorded in milliseconds and saved in `results/data.json`.

### Aggregation example

Used by Aeria.

```json
[
  {
    "$lookup": {
      "from": "person",
      "foreignField": "_id",
      "localField": "person",
      "as": "_person",
      "pipeline": []
    }
  },
  {
    "$lookup": {
      "from": "pet",
      "foreignField": "_id",
      "localField": "_person.pet",
      "as": "_person_pet",
      "pipeline": []
    }
  },
  {
    "$set": {
      "person": {
        "$cond": [
          {
            "$ne": [
              {
                "$indexOfArray": [
                  "$_person._id",
                  "$person"
                ]
              },
              -1
            ]
          },
          {
            "$mergeObjects": [
              {
                "$arrayElemAt": [
                  "$_person",
                  {
                    "$indexOfArray": [
                      "$_person._id",
                      "$person"
                    ]
                  }
                ]
              },
              {
                "pet": {
                  "$cond": [
                    {
                      "$ne": [
                        {
                          "$indexOfArray": [
                            "$_person_pet._id",
                            {
                              "$arrayElemAt": [
                                "$_person.pet",
                                {
                                  "$indexOfArray": [
                                    "$_person._id",
                                    "$person"
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        -1
                      ]
                    },
                    {
                      "$arrayElemAt": [
                        "$_person_pet",
                        {
                          "$indexOfArray": [
                            "$_person_pet._id",
                            {
                              "$arrayElemAt": [
                                "$_person.pet",
                                {
                                  "$indexOfArray": [
                                    "$_person._id",
                                    "$person"
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    null
                  ]
                }
              }
            ]
          },
          null
        ]
      }
    }
  },
  {
    "$unset": [
      "_person",
      "_person_pet"
    ]
  }
]
```

