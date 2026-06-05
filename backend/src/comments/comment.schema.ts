import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Comment {
  @Prop()
  id: string;

  @Prop()
  text: string;

  @Prop()
  userId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: Number, default: null })
  parentId: number | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);