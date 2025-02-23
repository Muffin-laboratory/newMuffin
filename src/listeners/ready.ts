import { ApplyOptions } from '@sapphire/decorators'
import { Listener } from '@sapphire/framework'
import { container } from '@sapphire/pieces'
import { Client } from 'discord.js'

@ApplyOptions<Listener.Options>({
  once: true,
})
export default class ClientReadyListener extends Listener {
  public run(client: Client<true>) {
    container.logger.info('먹힐 준비 완료')
  }
}
