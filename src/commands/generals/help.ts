import type { CategoryByEnglish } from '$lib/commandCategory'
import type { Context } from '$lib/context'
import { ApplyOptions } from '@sapphire/decorators'
import { Args, Command } from '@sapphire/framework'
import {
  Message,
  ChatInputCommandInteraction,
  EmbedBuilder,
  codeBlock,
  inlineCode,
} from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '도움말',
  aliases: ['도움', '명령어', 'help'],
  description: '기본적인 사용ㅂ법이에요.',
  detailedDescription: {
    usage: '머핀아 도움말 [명령어]',
    examples: ['머핀아 도움말', '머핀아 도움말 배워'],
  },
})
export default class HelpCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    const commands = this.container.stores.get('commands').map(command => {
      return {
        name: command.name,
        value: command.name,
      }
    })

    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setName('명령어')
            .setDescription('해당 명령어에 대ㅎ한 도움말을 볼 수 있어요.')
            .addChoices(commands),
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
    const commands = this.container.stores.get('commands')
    const commandName =
      ctx instanceof Message
        ? await args!.rest('string').catch(() => null)
        : ctx.options.getString('명령어')

    const embed = new EmbedBuilder()
      .setColor(this.container.embedColors.default)
      .setFooter({ text: `버전: ${this.container.version}` })
      .setThumbnail(ctx.client.user.displayAvatarURL())

    if (!commandName || !commands.get(commandName))
      return await ctx.reply({
        embeds: [
          embed.setTitle(`${ctx.client.user.username}의 도움말`).setDescription(
            codeBlock(
              'md',
              '# 일반\n' +
                this._getCommandsByCategory('generals')
                  .map(command => `- ${command?.name}: ${command?.description}`)
                  .join('\n') +
                '\n\n' +
                '# 채팅\n' +
                this._getCommandsByCategory('chattings')
                  .map(command => `- ${command?.name}: ${command?.description}`)
                  .join('\n'),
            ),
          ),
        ],
      })

    const { name, aliases, description, detailedDescription } =
      commands.get(commandName)!

    if (typeof detailedDescription === 'string') return

    return await ctx.reply({
      embeds: [
        embed
          .setTitle(`${ctx.client.user.username}의 ${name} 도움말`)
          .addFields(
            {
              name: '설명',
              value: inlineCode(description),
              inline: true,
            },
            {
              name: '사용법',
              value: inlineCode(detailedDescription.usage),
              inline: true,
            },
            aliases.length < 1
              ? {
                  name: '별칭',
                  value: '없음',
                }
              : {
                  name: '별칭',
                  value: codeBlock(
                    'md',
                    aliases.map(alias => `- ${alias}`).join('\n'),
                  ),
                },
            !detailedDescription.examples
              ? {
                  name: '예시',
                  value: '없음',
                }
              : {
                  name: '예시',
                  value: codeBlock(
                    'md',
                    detailedDescription.examples
                      ?.map(example => `- ${example}`)
                      .join('\n'),
                  ),
                },
          ),
      ],
    })
  }

  private _getCommandsByCategory(category: CategoryByEnglish) {
    return this.container.stores.get('commands').filter(command => {
      if (command.fullCategory.includes(category)) return command
    })
  }
}
