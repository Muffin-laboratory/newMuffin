import type { ChatInputCommandInteraction, Message } from 'discord.js'

export type Context = Message<true> | ChatInputCommandInteraction<'cached'>
