import type { Context } from '../lib/context'
import { Learn, Text } from '../lib/databases'
import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import {
  EmbedBuilder,
  Message,
  MessageFlags,
  type ChatInputCommandInteraction,
} from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '데이터학습량',
  aliases: ['학습데이터량', '데이터량', '학습량'],
  description: '봇이 학습한 데ㅇ이터량을 보여줘요.',
  detailedDescription: {
    usage: '머핀아 학습데이터량',
  },
})
export default class DataLengthCommand extends Command {
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
    let userId: string
    let username: string

    if (ctx instanceof Message) {
      userId = ctx.author.id
      username = ctx.author.username
    } else {
      userId = ctx.user.id
      username = ctx.user.username

      await ctx.deferReply({
        flags: [MessageFlags.Ephemeral],
      })
    }

    const textLength = (await Text.find()).length
    const muffinLength = (
      await Text.find({
        persona: 'muffin',
      })
    ).length
    const nsfwLength = (
      await Text.find({
        persona: /^user/,
      })
    ).length

    const learnLength = (await Learn.find()).length
    const userLearnLength = (
      await Learn.find({
        user_id: userId,
      })
    ).length

    const sum = textLength + learnLength

    const embed = new EmbedBuilder()
      .setTitle('저장된 데이터량')
      .setDescription(`총합: \`${sum}\`개`)
      .addFields(
        {
          name: '총 채팅 데이터량',
          value: `\`${textLength}\`개`,
          inline: true,
        },
        {
          name: '총 지식 데이터량',
          value: `\`${learnLength}\`개`,
          inline: true,
        },
        {
          name: '머핀 데이터량',
          value: `\`${muffinLength}\`개`,
        },
        {
          name: 'nsfw 데이터량',
          value: `\`${nsfwLength}\`개`,
          inline: true,
        },
        {
          name: `${username}님이 가르쳐준 데이터량`,
          value: `\`${userLearnLength}\`개`,
          inline: true,
        },
      )
      .setColor(this.container.embedColors.default)

    return ctx instanceof Message
      ? await ctx.reply({
          embeds: [embed],
        })
      : await ctx.editReply({
          embeds: [embed],
        })
  }
}
