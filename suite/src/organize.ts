import type { ResultsData } from './benchmark.js'
import * as fs from 'fs'
import { RESULTS_FILE } from './index.js'

const organizeResults = async () => {
  if( !fs.existsSync(RESULTS_FILE) ) {
    return
  }

  const content = await fs.promises.readFile(RESULTS_FILE, {
    encoding: 'utf-8',
  })

  const data: ResultsData = JSON.parse(content)

  data.results = Object.fromEntries(Object.entries(data.results).sort(([,a], [,b]) => {
    const as = Object.values(a)
    const bs = Object.values(b)

    const meanA = as.reduce((a, n) => a + n) / as.length
    const meanB = bs.reduce((a, n) => a + n) / bs.length

    return meanA - meanB
  }))

  await fs.promises.writeFile(RESULTS_FILE, JSON.stringify(data, null, 2))
  process.exit(0)
}

organizeResults()

