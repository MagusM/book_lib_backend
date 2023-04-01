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
        const wishlist = await WishlistModel.findOne({ userId });

        if (!wishlist) {
            // Wishlist doesn't exist, create a new one and add the book
            const newWishlist = new WishlistModel({
                userId,
                books: [book]
            });
            await newWishlist.save();
            res.status(200).send(newWishlist);
        } else {
            // Wishlist exists, check if the book is already in the list
            const bookExists = wishlist.books.some(b => b._id === book._id);

            if (bookExists) {
                res.status(409).send('Book already exists in wishlist');
            } else {
                wishlist.books.push(book);
                const updatedWishlist = await wishlist.save();
                res.status(200).send(updatedWishlist);
            }
        }
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
