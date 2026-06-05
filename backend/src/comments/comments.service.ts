import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  private mapComment(doc: any, index: number = 0) {
    if (!doc) return null;
    
    // Ensure we have a plain object
    const raw = doc.toObject ? doc.toObject() : doc;
    const obj = JSON.parse(JSON.stringify(raw));
    
    // Extract ID
    const id = obj._id?.toString() || obj.id?.toString() || `fallback-${Date.now()}-${index}`;
    
    // Robust parentId logic
    let parentId = obj.parentId;
    if (parentId === 'null' || !parentId) {
      parentId = null;
    } else {
      parentId = parentId.toString();
    }

    return {
      userId: 'Unknown User',
      text: '(empty comment)',
      likes: 0,
      createdAt: new Date().toISOString(),
      ...obj,
      id: id,
      _id: id,
      parentId,
    };
  }

  async getAll() {
    const comments = await this.commentModel.find().lean().exec();
    return (comments || []).map((c, i) => this.mapComment(c, i));
  }

  async add(data: any) {
    const created = await this.commentModel.create(data);
    return this.mapComment(created);
  }

  async update(id: string, text: string) {
    const updated = await this.commentModel.findByIdAndUpdate(id, { text }, { new: true });
    return this.mapComment(updated);
  }

  async delete(id: string) {
    return this.commentModel.findByIdAndDelete(id);
  }

  async like(id: string) {
    const updated = await this.commentModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    return this.mapComment(updated);
  }
}