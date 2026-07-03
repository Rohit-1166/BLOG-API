import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IPost extends Document {
  title: string;
  content: string;
  author: IUser['_id'];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: [true, 'Please provide content for the post'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and pagination
PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ createdAt: -1 });

export default mongoose.model<IPost>('Post', PostSchema);
