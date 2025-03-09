import { Config } from './config'
import { ReleaseChannel } from './lib/releaseChannel'
import { container } from '@sapphire/pieces'
import type { Client } from 'dokdo'
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
    channel: ReleaseChannel
    dokdo: Client
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
container.version = '5.0.0-yogurt_canary.250309a'
container.embedColors = {
  default: 0xaddb87,
  fail: 0xff0000,
  success: 0x00ff00,
}

if (container.version.includes(ReleaseChannel.Release))
  container.channel = ReleaseChannel.Release
else if (container.version.includes(ReleaseChannel.Preview))
  container.channel = ReleaseChannel.Preview
else if (container.version.includes(ReleaseChannel.Dev))
  container.channel = ReleaseChannel.Dev
else if (container.version.includes(ReleaseChannel.Canary))
  container.channel = ReleaseChannel.Canary

await connect(container.config.databaseUrl)
