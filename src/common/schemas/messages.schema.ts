import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId, SchemaTypes } from 'mongoose';

export type MessagesDocument = Messages & Document;

@Schema({
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
})
export class Messages {
  @Prop({ auto: true })
  _id!: mongoose.Schema.Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  from: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, default: null })
  to?: ObjectId;

  @Prop({ type: String, required: true, default: '' })
  message: string;

  @Prop({ type: String, default: null })
  room?: string;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
