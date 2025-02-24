import { Listener } from '@sapphire/framework'
import type { Message, TextChannel } from 'discord.js'

export class MessageCreateListener extends Listener {
  private _getRandom(length: number) {
    return Math.floor(Math.random() * length)
  }

  public async run(msg: Message) {
    let data: Array<
      | {
          id: number
          text: string
          created_at: Date | null
          persona: string
        }
      | {
          id: number
          text: string
          search_text: string
          conversation: string
          created_at: Date | null
          in_response_to: string | null
          search_in_response_to: string
          persona: string
        }
    > = []

    if (msg.author.bot) return
    const content = msg.content.slice(this.container.prefix.length)

    if (msg.author.id === this.container.config.train.userId) {
      await this.container.database.statement.create({
        data: {
          text: msg.content.slice(this.container.prefix.length),
          persona: 'muffin',
        },
      })
    }

    if (!msg.content.startsWith(this.container.prefix)) return
    if (this.container.stores.get('commands').get(content)) return

    const randomNumber = this._getRandom(5)

    ;(await this.container.database.statement.findMany()).forEach(muffinData =>
      data.push(muffinData),
    )

    if ((msg.channel as TextChannel).nsfw) {
      ;(await this.container.database.nsfw_content.findMany()).forEach(
        nsfwData => data.push(nsfwData),
      )

      await this.container.database.nsfw_content.create({
        data: {
          text: content,
          persona: `user:${msg.author.username.slice(0, 45).toLowerCase()}`,
        },
      })
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
