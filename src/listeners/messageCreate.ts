import { Listener } from '@sapphire/framework'
import type { Message, TextChannel } from 'discord.js'

export class MessageCreateListener extends Listener {
  private _getRandom(length: number) {
    return Math.floor(Math.random() * length)
  }

  public async run(msg: Message) {
    let data: any[] = []

    if (msg.author.bot) return
    if (!msg.content.startsWith(this.container.prefix)) return
    const content = msg.content.split(' ')[1]

    if (this.container.stores.get('commands').get(content)) return

    const randomNumber = this._getRandom(5)

    ;(await this.container.database.statement.findMany()).forEach(muffinData =>
      data.push(muffinData),
    )

    if ((msg.channel as TextChannel).nsfw) {
      ;(await this.container.database.nsfw_content.findMany()).forEach(
        nsfwData => data.push(nsfwData),
      )
    }

    const learnDatas = await this.container.database.learn.findMany({
      where: {
        command: content,
      },
    })

    if (randomNumber > 2 && learnDatas.length) {
      const learnData = learnDatas[this._getRandom(learnDatas.length)]
      const { username } = await this.container.client.users.fetch(
        learnData.user_id,
      )

      return await msg.reply(
        `${learnData.result}\n\`${username}님이 알려주셨어요.\``,
      )
    }

    return await msg.reply(data[this._getRandom(data.length)].text)
  }
}
