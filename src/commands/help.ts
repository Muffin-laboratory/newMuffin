import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import type { ChatInputCommandInteraction, Message } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '도움말',
  aliases: ['도움', '명령어', 'help'],
  description: '기본적인 사용ㅂ법이에요.',
})
export default class HelpCommand extends Command {
  private async _run(
    ctx: Message<true> | ChatInputCommandInteraction<'cached'>,
  ) {
    ctx.reply('현재 준ㅂ비중')
  }

  public async messageRun(message: Message<true>) {
    await this._run(message)
  }
}
