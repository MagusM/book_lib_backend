import axios from 'axios';
import { Request, RequestHandler, Response } from 'express';
import Book, { Book as BookType } from '../models/Book';
import Wishlist from '../models/Wishlist';

const getBooks: RequestHandler = async (req, res) => {
    try {
        if (!req.query.userId) {
            return res.status(400).send('missing userId');
        }
        const search = req.query.q || 'all';
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;

        const API_KEY = process.env.GOOGLE_BOOKS_KEY;
        const response = await axios.get(process.env.GOOGLE_BOOKS_API, {
            params: {
                q: search,
                startIndex: (page - 1) * pageSize,
                maxResults: pageSize,
                key: API_KEY
            }
        });

        const totalBooks = response.data.totalItems;

        const books = response.data.items.map((item: any) => {
            const id = item.id;
            const title = item.volumeInfo.title;
            const author = item.volumeInfo.authors?.[0] || 'John Doe';
            const imageUrl = item.volumeInfo.imageLinks?.thumbnail || '';
            const description = item.volumeInfo.description;
            
            return { id, title, author, imageUrl, description };
        });

        return res.status(200).json({
            success: true,
            data: books,
            page,
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
