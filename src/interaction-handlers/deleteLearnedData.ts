import { MuffinCustomId } from '../lib/customId'
import { Learn } from '../lib/databases'
import { ApplyOptions } from '@sapphire/decorators'
import {
  InteractionHandler,
  InteractionHandlerTypes,
} from '@sapphire/framework'
import {
  EmbedBuilder,
  MessageFlags,
  type ButtonInteraction,
  type StringSelectMenuInteraction,
} from 'discord.js'

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.MessageComponent,
})
export default class DeleteLearnedDataHandler extends InteractionHandler {
  public async parse(
    interaction: StringSelectMenuInteraction | ButtonInteraction,
  ) {
    const userId = interaction.isButton()
      ? interaction.customId.slice(
          MuffinCustomId.DeleteLearnedDataCancel.length,
        )
      : interaction.customId.slice(
          MuffinCustomId.DeleteLearnedDataUserId.length,
        )

    if (interaction.user.id !== userId) {
      await interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setTitle('❌ 오류')
            .setDescription('당신은 해당 권한이 없ㅇ어요.')
            .setColor(this.container.embedColors.fail),
        ],
      })
    }
    if (interaction.isButton()) {
      if (
        !interaction.customId.startsWith(MuffinCustomId.DeleteLearnedDataCancel)
      )
        return this.none()
      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle('❌ 취소')
            .setDescription(`지식 삭제 작업ㅇ을 취소했어요.`)
            .setColor(this.container.embedColors.fail),
        ],
        components: [],
      })
      return this.none()
    }

    if (
      !interaction.customId.startsWith(MuffinCustomId.DeleteLearnedDataUserId)
    )
      return this.none()

    return this.some()
  }

  public async run(interaction: StringSelectMenuInteraction) {
    await interaction.deferUpdate()

    const itemIdRegexp = /No.\d+/

    const id = interaction.values[0]
      .slice(MuffinCustomId.DeleteLearnedData.length)
      .replace(itemIdRegexp, '')
      .replaceAll('&', '')
    const itemId = interaction.values[0].match(itemIdRegexp)!.join()

    await Learn.findByIdAndDelete(id)

    return await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ 삭제 완료')
          .setDescription(`${itemId.slice(3)}번을 삭ㅈ제했어요.`)
          .setColor(this.container.embedColors.success),
      ],
      components: [],
    })
  }
}
