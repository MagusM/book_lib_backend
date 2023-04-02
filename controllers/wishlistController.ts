import { Request, Response } from 'express';
import WishlistModel from '../models/Wishlist';
import BookModel, { Book as BookI } from '../models/Book';

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
            const bookIds = await Promise.all(
                books.map(async (book) => {
                    const newBook = new BookModel(book);
                    await newBook.save();
                    return newBook._id;
                })
            );

            const newWishlist = new WishlistModel({
                userId,
                books: bookIds,
            });
            await newWishlist.save();
            return res.status(200).send(newWishlist);
        } else {
            // Wishlist exists, get the current books array
            const currentBookIds = wishlist.books;

            // Build a new books array from the input and from mongo, making sure there are no duplicates
            const newBookIds = [
                ...currentBookIds,
                ...books
                    .filter((book) => !currentBookIds.includes(book._id))
                    .map((book) => new BookModel(book))
                    .map(async (newBook) => {
                        await newBook.save();
                        return newBook._id;
                    }),
            ];

            // Update the wishlist with the new books array
            wishlist.books = newBookIds;
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
