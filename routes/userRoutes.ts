import express, { Request as ExpressRequest, Response } from 'express';
import { getUserById, getUserByName, login, updateUser } from '../controllers/userController';
import jwtAuthenticate from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);
// Retrieve user by ID
router.get('/:id', getUserById);
router.get('/name/:name', getUserByName);
/**
 * Update user lastLoggedIn date
 * 
 * todo: consider move this logic to be part of login logic instead
 */
router.put('/:id', jwtAuthenticate, updateUser);

export default router;
