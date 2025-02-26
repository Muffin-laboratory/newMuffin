import { Config } from './config'
import { container } from '@sapphire/pieces'
import { connect, disconnect } from 'mongoose'

declare module '@sapphire/pieces' {
  interface Container {
    dbDisconnect: () => Promise<void>
    config: Config
    prefix: string
    version: string
  }
}

container.dbDisconnect = async () => await disconnect()
container.config = new Config()
container.prefix = container.config.bot.prefix
container.version = '5.0.0-newMuffin.e240226a'

await connect(container.config.databaseUrl)
