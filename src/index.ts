import './init'
import { SapphireClient } from '@sapphire/framework'
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
})

client.login(container.config.bot.token)
