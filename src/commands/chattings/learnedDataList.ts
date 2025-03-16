import type { Context } from '../../lib/context'
import { Learn } from '../../lib/databases'
import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import {
  codeBlock,
  EmbedBuilder,
  Message,
  type ChatInputCommandInteraction,
} from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '리스트',
  aliases: ['list', '목록', '지식목록'],
  description: '당신이 가ㄹ르쳐준 단어를 나열해요.',
  detailedDescription: {
    usage: '머핀아 리스트',
  },
})
export default class LearnedDataListCommand extends Command {
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
    const user = ctx instanceof Message ? ctx.author : ctx.user
    const datas = await Learn.find({ user_id: user.id })

    if (!datas.length)
      return await ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('❌ 오류')
            .setDescription('당신은 지식ㅇ을 가르쳐준 적이 없어요!')
            .setColor(this.container.embedColors.fail),
        ],
      })

    return await ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${user.displayName}님이 알려주신 지식`)
          .setDescription(
            codeBlock(
              'md',
              `# 총 ${datas.length}개에요.\n` +
                datas
                  .map(data => `- ${data.command}: ${data.result}`)
                  .join('\n'),
            ),
          )
          .setThumbnail(user.displayAvatarURL())
          .setColor(this.container.embedColors.default),
      ],
    })
  }
}
