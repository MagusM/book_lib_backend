import { Request, Response } from 'express';
import WishlistModel from '../models/Wishlist';
import BookModel, { Book as BookI } from '../models/Book';

export const getWishlist = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const wishlist = await WishlistModel.findOne({ userId });

    if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.json({
        id: wishlist._id.toString(),
        userId: userId,
        books: wishlist.books,
    });
};

export const addBookToWishlist = async(req: Request, res: Response) => {
    const userId = req.params.userId;
    const books = req.body.books;

    // Find the user's wishlist
    const wishlist = await WishlistModel.findOne({ userId });
    if (!books.length) {
        return res.status(200).json(wishlist);
    }

    if (!wishlist) {
        // If the user doesn't have a wishlist yet, create a new one
        const newWishlist = new WishlistModel({
            userId,
            books: books,
        });
        // return res.json(newWishlist);
        await newWishlist.save();
        return res.status(201).json(newWishlist);
    } else {
        // Otherwise, add the new books to the existing wishlist
        const currArrayBooksIds = wishlist.books.map((book: BookI) => book.id);
        for (let book of books) {
            if (!currArrayBooksIds.includes(book.id)) {
                wishlist.books.push(book);
            }
        }
        await wishlist.save();
        return res.status(200).json(wishlist);
    }
}


export const deleteBookFromWishlist = async (req: Request, res: Response) => {
    const { userId, bookId } = req.params;

    try {
        const wishlist = await WishlistModel.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        const newBooks = wishlist.books.filter((book: BookI) => book.id.toString() !== bookId);
        wishlist.books = newBooks;
        await wishlist.save();
        return res.status(200).json(wishlist);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error deleting book from wishlist');
    }
};




