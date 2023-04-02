import { Request, Response } from 'express';
import WishlistModel from '../models/Wishlist';
import { Book } from '../models/Book';

export const getWishlist = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const wishlist = await WishlistModel.findOne({ userId });
        return res.status(200).send(wishlist);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching wishlist');
    }
};

export const addBookToWishlist = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { books } = req.body;

    try {
        const wishlist = await WishlistModel.findOne({ userId });

        if (!wishlist) {
            // Wishlist doesn't exist, create a new one and add the books
            const newWishlist = new WishlistModel({
        userId,
                books
    });
            await newWishlist.save();
            return res.status(200).send(newWishlist);
        } else {
            // Wishlist exists, get the current books array
            const currentBooks = wishlist.books;

            // Build a new books array from the input and from mongo, making sure there are no duplicates
            const newBooks = [
                ...currentBooks,
                ...books.filter((book) => !currentBooks.some((b) => b._id === book._id)),
            ];

            // Update the wishlist with the new books array
            wishlist.books = newBooks;
            const updatedWishlist = await wishlist.save();
            return res.status(200).send(updatedWishlist);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error adding book(s) to wishlist');
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

        return res.status(200).send(wishlist);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error deleting book from wishlist');
    }
};
