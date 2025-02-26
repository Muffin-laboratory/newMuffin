import { type Document, model, Schema } from 'mongoose'

export interface IText extends Document {
  text: string
  persona: string
  created_at: Date
}

export const Text = model<IText>(
  'Text',
  new Schema<IText>({
    text: { type: String, required: true },
    persona: { type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now },
  }),
  'text',
)
