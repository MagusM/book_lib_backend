import { Router } from 'express';
import { getWishlist, addBookToWishlist, deleteBookFromWishlist } from '../controllers/wishlistController';
import jwtAuthenticate from '../middlewares/authMiddleware';

const router = Router();

router.get('/:userId', jwtAuthenticate, getWishlist);
router.post('/:userId', jwtAuthenticate, addBookToWishlist);
router.delete('/:userId/:bookId', jwtAuthenticate, deleteBookFromWishlist);

export default router;
