import axios from 'axios';
import { Request, Response } from 'express';
import { Book } from '../models/Book';

export const getBooks = async (req: Request, res: Response) => {
    const { q, startIndex, maxResults } = req.query;

    try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q,
                startIndex,
                maxResults
            }
        });

        res.status(200).send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching books');
    }
};
