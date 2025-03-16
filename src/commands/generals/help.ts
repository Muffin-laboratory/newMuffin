import type { Context } from '../../lib/context'
import { ApplyOptions } from '@sapphire/decorators'
import { Args, Command } from '@sapphire/framework'
import type { ChatInputCommandInteraction, Message } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '도움말',
  aliases: ['도움', '명령어', 'help'],
  description: '기본적인 사용ㅂ법이에요.',
})
export default class HelpCommand extends Command {
  public async messageRun(msg: Message<true>, args: Args) {
    return await this._run(msg, args)
  }

  public async chatInputRun(
    interaction: ChatInputCommandInteraction<'cached'>,
  ) {
    return await this._run(interaction)
  }

  private async _run(ctx: Context, args?: Args) {}
}
