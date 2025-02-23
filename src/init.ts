import { Config } from './config'
import { PrismaClient } from '@prisma/client'
import { container } from '@sapphire/pieces'

declare module '@sapphire/pieces' {
  interface Container {
    config: Config
    prefix: string
    version: string
    database: PrismaClient
  }
}

container.config = new Config()
container.prefix = container.config.bot.prefix
container.version = '5.0.0-newMuffin.e240223a'
container.database = new PrismaClient()
