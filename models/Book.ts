import mongoose, { Schema, Document } from 'mongoose';

export interface Book extends Document {
    title: string;
    author: string;
    imageUrl?: string;
    description?: string;
    publishedDate?: Date;
}

const BookSchema: Schema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String },
    description: { type: String },
    publishedDate: { type: Date }
});

export default mongoose.model<Book>('Book', BookSchema);
