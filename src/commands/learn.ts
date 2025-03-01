import { Learn } from '../lib/databases'
import { ApplyOptions } from '@sapphire/decorators'
import { Args, Command } from '@sapphire/framework'
import { ChatInputCommandInteraction, codeBlock, Message } from 'discord.js'
import { josa } from 'es-hangul'

@ApplyOptions<Command.Options>({
  name: '배워',
  aliases: ['공부'],
  description: '단어를 가르치는 명령ㅇ어에요.',
  detailedDescription: {
    usage: '머핀아 배워 (등록할 단어) (대답)',
    examples: [
      '머핀아 배워 안녕 안녕!',
      '머핀아 배워 "야 죽을래?" "아니요 ㅠㅠㅠ"',
      '머핀아 배워 미간은_누구야? 이봇의_개발자요',
    ],
  },
})
export default class LearnCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setRequired(true)
            .setName('단어')
            .setDescription('등록할 단어를 입력해주세요.'),
        )
        .addStringOption(option =>
          option
            .setRequired(true)
            .setName('대답')
            .setDescription('해당 단어의 대답을 입력해주세요.'),
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

  private async _run(
    ctx: Message<true> | ChatInputCommandInteraction<'cached'>,
    args?: Args,
  ) {
    const userId = ctx instanceof Message ? ctx.author.id : ctx.user.id
    let command: string | undefined
    let result: string | undefined

    if (typeof this.detailedDescription === 'string') return
    if (ctx instanceof ChatInputCommandInteraction) {
      await ctx.deferReply()

      command = ctx.options.getString('단어', true)
      result = ctx.options.getString('대답', true)
    } else {
      if (!args) return
      command = (await args.pick('string').catch(() => undefined))?.replaceAll(
        '_',
        ' ',
      )
      result = (await args.pick('string').catch(() => undefined))?.replaceAll(
        '_',
        ' ',
      )
    }

    if (!command || !result)
      return await ctx.reply(
        codeBlock(
          'md',
          `사용법: ${this.detailedDescription.usage}\n` +
            `예시: ${this.detailedDescription.examples?.map(example => example).join('\n')}`,
        ),
      )

    let commands: string[] = []
    let aliases: string[] = []

    for (const [name, command] of this.container.stores.get('commands')) {
      commands = [...commands, name]
      aliases = [...aliases, ...command.aliases]
    }

    const ignores = [...commands, ...aliases, '미간', 'Migan', 'migan', '간미']
    const disallows = [
      '@everyone',
      '@here',
      `<@${this.container.config.bot.ownerId}>`,
    ]

    for (const ignore of ignores) {
      if (command.includes(ignore))
        return ctx instanceof Message
          ? await ctx.reply('해ㄷ당 단어는 배울ㄹ 수 없어요.')
          : await ctx.editReply('해ㄷ당 단어는 배울ㄹ 수 없어요.')
    }

    for (const disallowed of disallows) {
      if (result.includes(disallowed))
        return ctx instanceof Message
          ? await ctx.reply('해당 단ㅇ어는 개발자님이 특별히 금지하였ㅇ어요.')
          : await ctx.editReply(
              '해당 단ㅇ어는 개발자님이 특별히 금지하였ㅇ어요.',
            )
    }

    await new Learn({
      command,
      result,
      user_id: userId,
    }).save()

    return ctx instanceof Message
      ? await ctx.reply(`${josa(command, '을/를')} 배웠ㅇ어요.`)
      : await ctx.editReply(`${josa(command, '을/를')} 배웠ㅇ어요.`)
  }
}
