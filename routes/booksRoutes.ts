import { Router } from 'express';
import { getBooks } from '../controllers/booksController';
import jwtAuthenticate from '../middlewares/authMiddleware';

const router = Router();

router.get('/', jwtAuthenticate, getBooks);

export default router;
