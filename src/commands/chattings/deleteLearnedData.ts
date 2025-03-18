import type { Context } from '$lib/context'
import { MuffinCustomId } from '$lib/customId'
import { Learn } from '$lib/databases'
import { ApplyOptions } from '@sapphire/decorators'
import { Args, Command } from '@sapphire/framework'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  codeBlock,
  EmbedBuilder,
  inlineCode,
  Message,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '삭제',
  aliases: ['잊어', '지워'],
  description: '당신이 가르쳐준 단ㅇ어를 삭제해요.',
  detailedDescription: {
    usage: '머핀아 삭제 (삭제할 단어)',
    examples: ['머핀아 삭제 머핀'],
  },
})
export default class DeleteLearnedData extends Command {
  public registerApplicationCommand(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setName('단어')
            .setDescription('삭제할 단어를 입ㄹ력해주세요.')
            .setRequired(true),
        ),
    )
  }

  public async messageRun(msg: Message<true>, args: Args) {
    return await this._run(msg, args)
  }

  public async chatInputRun(
    interaction: ChatInputCommandInteraction<'cached'>,
  ) {
    return await this._run(interaction)
  }

  private async _run(ctx: Context, args?: Args) {
    let command: string | undefined
    let userId: string

    if (typeof this.detailedDescription === 'string') return
    if (ctx instanceof Message) {
      if (!args) return
      command = await args.rest('string').catch(() => undefined)
      userId = ctx.author.id
    } else {
      command = ctx.options.getString('단어', true)
      userId = ctx.user.id
    }

    if (!command) {
      // 오직 메세지 커맨드로 사용하였을 때만 표출되는 오류 메세지
      return await ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('❌ 오류')
            .setDescription('올바르지 않ㅇ은 용법이에요.')
            .addFields(
              {
                name: '사용법',
                value: inlineCode(this.detailedDescription.usage),
              },
              {
                name: '예시',
                value: this.detailedDescription
                  .examples!.map(example => inlineCode(example))
                  .join('\n'),
              },
            )
            .setColor(this.container.embedColors.fail),
        ],
      })
    }

    const datas = await Learn.find({
      command,
      user_id: userId,
    })

    if (!datas.length)
      return await ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('❌ 오류')
            .setDescription('해당 하는 지식ㅇ을 찾을 수 없어요.')
            .setColor(this.container.embedColors.fail),
        ],
      })

    const options: StringSelectMenuOptionBuilder[] = []
    let description = ''

    for (let i = 1; i <= datas.length; i++) {
      const data = datas[i - 1]
      options.push(
        new StringSelectMenuOptionBuilder()
          .setLabel(`${i}번 지식`)
          .setDescription(data.result)
          .setValue(MuffinCustomId.DeleteLearnedData + data.id + `&No.${i}`),
      )
      description += `${i}. ${data.result}\n`
    }

    return await ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${command} 삭제`)
          .setDescription(
            `${command}에 대한 대답 중 하나를 선ㅌ택하여 삭제해주세요.\n` +
              codeBlock('md', description),
          )
          .setColor(this.container.embedColors.default),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(MuffinCustomId.DeleteLearnedDataUserId + userId)
            .addOptions(options)
            .setPlaceholder('ㅈ지울 응답을 선택해주세요.'),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(MuffinCustomId.DeleteLearnedDataCancel + userId)
            .setLabel('취소하기')
            .setStyle(ButtonStyle.Danger),
        ),
      ],
    })
  }
}
