import { Router } from 'express';
import { getBooks } from '../controllers/booksController';
import requireSession from '../middlewares/authMiddleware';

const router = Router();

router.get('/', requireSession, getBooks);

export default router;
