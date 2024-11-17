import { MongoMemoryServer } from 'mongodb-memory-server'

const main = async () => {
  // this line will trigger the download of the binaries
  const instance = await MongoMemoryServer.create()
  instance.stop()
}
main()
