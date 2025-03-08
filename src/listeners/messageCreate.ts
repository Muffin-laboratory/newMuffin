import { Learn, Text, type IText } from '../lib/databases'
import { ReleaseChannel } from '../lib/releaseChannel'
import { Listener } from '@sapphire/framework'
import type { Message, TextChannel } from 'discord.js'

export class MessageCreateListener extends Listener {
  private _getRandom(length: number) {
    return Math.floor(Math.random() * length)
  }

  public async run(msg: Message<true>) {
    let datas: IText[] = []

    if (msg.author.bot) return
    const content = msg.content.slice(this.container.prefix.length)

    if (
      this.container.channel === ReleaseChannel.Release &&
      this.container.config.train.userId &&
      msg.author.id === this.container.config.train.userId
    )
      await new Text({
        text: msg.content.slice(this.container.prefix.length),
        persona: 'muffin',
      }).save()

    if (!msg.content.startsWith(this.container.prefix)) return
    if (this.container.stores.get('commands').get(content.split(' ')[0])) return

    await msg.channel.sendTyping()

    const randomNumber = this._getRandom(5)

    if ((msg.channel as TextChannel).nsfw) {
      ;(await Text.find()).forEach(data => datas.push(data))

      if (this.container.channel === ReleaseChannel.Release)
        await new Text({
          text: content,
          persona: `user:${msg.author.username.slice(0, 45).toLowerCase()}`,
        }).save()
    } else {
      ;(await Text.find({ persona: 'muffin' })).forEach(data =>
        datas.push(data),
      )
    }

    const learnDatas = await Learn.find({
      command: content,
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

    return await msg.reply(datas[this._getRandom(datas.length)].text)
  }
}
