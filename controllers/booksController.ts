import axios from 'axios';
import { Request, RequestHandler, Response } from 'express';
import Book, { Book as BookType } from '../models/Book';

//https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=YOUR_API_KEY

const getBooks: RequestHandler = async (req, res) => {
    try {
        const search = req.body.search;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 10;

        const query = search
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const totalBooks = await Book.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / pageSize);

        const books = await Book.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort('title')
            .exec();

        return res.status(200).json({
            success: true,
            data: books,
            page,
            totalPages,
            totalBooks,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export {
    getBooks
}
