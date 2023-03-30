import { Router } from 'express';
import { getWishlist, addBookToWishlist, deleteBookFromWishlist } from '../controllers/wishlistController';

const router = Router();

router.get('/:userId', getWishlist);
router.post('/:userId', addBookToWishlist);
router.delete('/:userId/:bookId', deleteBookFromWishlist);

export default router;
