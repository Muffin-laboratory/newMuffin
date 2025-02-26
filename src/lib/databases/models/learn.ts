import { model, Schema, type Document } from 'mongoose'

export interface ILearn extends Document {
  command: string
  result: string
  user_id: string
  created_at: Date
}

export const Learn = model<ILearn>(
  'Learn',
  new Schema<ILearn>({
    command: { type: String, required: true },
    result: { type: String, required: true },
    user_id: { type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now },
  }),
  'learn',
)
