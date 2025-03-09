import { ApplyOptions } from '@sapphire/decorators'
import { Listener } from '@sapphire/framework'
import { Client } from 'discord.js'
import { Client as DokdoClient } from 'dokdo'

@ApplyOptions<Listener.Options>({
  once: true,
})
export default class ClientReadyListener extends Listener {
  public run(client: Client<true>) {
    this.container.dokdo = new DokdoClient(client, {
      prefix: this.container.prefix,
      owners: [this.container.config.bot.ownerId],
      secrets: [this.container.config.databaseUrl],
      aliases: ['dokdo', 'dok', 'Dokdo', 'Dok', '테스트'],
      globalVariable: { container: this.container },
      noPerm: async msg =>
        await msg.reply({
          content: '당신은 내 제작자가 아니잖아!',
          allowedMentions: {
            repliedUser: false,
            parse: [],
            users: [],
            roles: [],
          },
        }),
    })
    this.container.logger.info('먹힐 준비 완료')
  }
}
