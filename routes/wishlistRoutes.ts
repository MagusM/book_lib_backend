import { Router } from 'express';
import { getWishlist, addBookToWishlist, deleteBookFromWishlist } from '../controllers/wishlistController';
import requireSession from '../middlewares/authMiddleware';

const router = Router();

router.get('/:userId', requireSession, getWishlist);
router.post('/:userId', requireSession, addBookToWishlist);
router.delete('/:userId/:bookId', requireSession, deleteBookFromWishlist);

export default router;
