import { Router } from 'express';
import { getBooks } from '../controllers/booksController';

const router = Router();

router.get('/', getBooks);

export default router;