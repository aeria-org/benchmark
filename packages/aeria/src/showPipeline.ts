import { getLookupPipeline } from 'aeria'
import { collections } from 'common'

const main = async () => {
  console.log(JSON.stringify(await getLookupPipeline(collections.deep.description), null, 2))
  process.exit(0)
}

main()
