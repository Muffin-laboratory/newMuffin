import { Config } from './config'
import { container } from '@sapphire/pieces'
import { connect, disconnect } from 'mongoose'

declare module '@sapphire/pieces' {
  interface Container {
    dbDisconnect: () => Promise<void>
    config: Config
    prefix: string
    version: string
    embedColors: {
      default: number
      fail: number
      success: number
    }
  }
}

declare module '@sapphire/framework' {
  interface DetailedDescriptionCommandObject {
    usage: string
    examples?: string[]
  }
}

container.dbDisconnect = async () => await disconnect()
container.config = new Config()
container.prefix = container.config.bot.prefix
container.version = '5.0.0-yogurt.e250307a'
container.embedColors = {
  default: 0xaddb87,
  fail: 0xff0000,
  success: 0x00ff00,
}

await connect(container.config.databaseUrl)
