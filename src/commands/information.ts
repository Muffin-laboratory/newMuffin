import type { Context } from '../lib/context'
import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  inlineCode,
  Message,
  time,
} from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '정보',
  description: '머핀봇의 정보를 알ㄹ려줘요.',
  detailedDescription: {
    usage: '머핀아 정보',
  },
})
export default class InformationCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    )
  }

  public async messageRun(msg: Message<true>) {
    return await this._run(msg)
  }

  public async chatInputRun(
    interaction: ChatInputCommandInteraction<'cached'>,
  ) {
    return await this._run(interaction)
  }

  private async _run(ctx: Context) {
    return await ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${ctx.client.user.username}의 정보`)
          .addFields(
            {
              name: '운영 체제',
              value: inlineCode(`${process.platform} ${process.arch}`),
            },
            {
              name: '제작자',
              value: inlineCode(
                (
                  await ctx.client.users.fetch(
                    this.container.config.bot.ownerId,
                  )
                ).username,
              ),
            },
            {
              name: '버전',
              value: inlineCode(this.container.version),
            },
            {
              name: '최근에 업데이트된 날짜',
              value: time(this.container.updatedAt, 'R'),
              inline: true,
            },
            {
              name: '업타임',
              value: time(ctx.client.readyAt, 'R'),
              inline: true,
            },
          )
          .setColor(this.container.embedColors.default)
          .setThumbnail(ctx.client.user.displayAvatarURL()),
      ],
    })
  }
}
