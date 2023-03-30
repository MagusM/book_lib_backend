import { Request, Response } from 'express';
import WishlistModel from '../models/Wishlist';
import { Book } from '../models/Book';

export const getWishlist = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const wishlist = await WishlistModel.findOne({ userId });
        res.status(200).send(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching wishlist');
    }
};

export const addBookToWishlist = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { book } = req.body;

    try {
        const wishlist = await WishlistModel.findOneAndUpdate(
            { userId },
            { $push: { books: book } },
            { new: true, upsert: true }
        );

        res.status(200).send(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding book to wishlist');
    }
};

export const deleteBookFromWishlist = async (req: Request, res: Response) => {
    const { userId, bookId } = req.params;

    try {
        const wishlist = await WishlistModel.findOneAndUpdate(
            { userId },
            { $pull: { books: { id: bookId } } },
            { new: true }
        );

        res.status(200).send(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting book from wishlist');
    }
};
