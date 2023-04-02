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

async function bookExistsInWishlist(book: BookI, currentBookIds: string[], newBookIds: string[]) {
    const existingBook = await BookModel.findOne({ id: book.id });
    const bookId = existingBook?._id.toString();
    return currentBookIds.includes(bookId) || newBookIds.includes(bookId);
}

export const addBookToWishlist = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { books } = req.body;

    try {
        const wishlist = await WishlistModel.findOne({ userId });

        if (!wishlist) {
            // Wishlist doesn't exist, create a new one and add the books
            const bookIds = [];

            for (const book of books) {
                // Check if the book already exists in the database
                const existingBook = await BookModel.findOne({ id: book.id });

                if (!existingBook) {
                    // Book does not exist, create and save it
                    const newBook = new BookModel({
                        title: book.title,
                        author: book.author,
                        imageUrl: book.imageUrl,
                        description: book.description,
                        publishedDate: book.publishedDate,
                    });
                    await newBook.save();
                    bookIds.push(newBook._id);
                } else {
                    // Book already exists, use its ID if it's not in the wishlist yet
                    const bookId = existingBook._id.toString();
                    if (!wishlist.books.includes(bookId)) {
                        bookIds.push(existingBook._id);
                    }
                }
            }

            const newWishlist = new WishlistModel({
                userId,
                books: bookIds,
            });
            await newWishlist.save();
            return res.status(200).send(newWishlist);
        } else {
            // Wishlist exists, get the current books array
            const currentBookIds = wishlist.books.map(book => book.toString());

            // Build a new books array from the input and from mongo, making sure there are no duplicates
            const newBookIds = [];

            for (const book of books) {
                const existingBook = await BookModel.findOne({ id: book.id });

                if (existingBook && !currentBookIds.includes(existingBook._id.toString()) && !newBookIds.includes(existingBook._id)) {
                    newBookIds.push(existingBook._id);
                } else if (!existingBook) {
                    const newBook = new BookModel({
                        title: book.title,
                        author: book.author,
                        imageUrl: book.imageUrl,
                        description: book.description,
                        publishedDate: book.publishedDate,
                    });
                    await newBook.save();
                    newBookIds.push(newBook._id);
                }
            }

            // Update the wishlist with the new books array
            wishlist.books = [...currentBookIds, ...newBookIds];
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
            { $pull: { books: { _id: { $elemMatch: { _id: bookId } } } } },
            { new: true }
        );

        return res.status(200).send(wishlist);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error deleting book from wishlist');
    }
};


