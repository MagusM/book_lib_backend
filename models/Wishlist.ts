import mongoose, { Schema, Document } from 'mongoose';
import { Book } from './Book';

export interface Wishlist extends Document {
    userId: string;
    books: Book[];
}

const WishlistSchema: Schema = new Schema({
    userId: { type: String, required: true },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
});

export default mongoose.model<Wishlist>('Wishlist', WishlistSchema);
