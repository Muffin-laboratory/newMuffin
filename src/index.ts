import './init'
import { LogLevel, SapphireClient } from '@sapphire/framework'
import { container } from '@sapphire/pieces'
import { GatewayIntentBits, Partials } from 'discord.js'

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  loadMessageCommandListeners: true,
  defaultPrefix: container.prefix,
  allowedMentions: {
    users: [],
    roles: [],
    repliedUser: true,
  },
  partials: [Partials.Message, Partials.ThreadMember],
  logger: {
    level:
      container.config.nodeEnv === 'development'
        ? LogLevel.Debug
        : LogLevel.Info,
  },
})

client.on('debug', container.logger.debug)
client.on('error', container.logger.error)

client.login(container.config.bot.token)
