import express, { Request as ExpressRequest, Response } from 'express';
import { IUser } from '../models/User';
import UserModel from '../models/User';
import requireSession from '../middlewares/authMiddleware';
import { getUserById, login, updateUser } from '../controllers/userController';

const router = express.Router();

router.post('/login', login);
// Retrieve user by ID
router.get('/:id', getUserById);
/**
 * Update user lastLoggedIn date
 * 
 * todo: consider move this logic to be part of login logic instead
 */
router.put('/:id', requireSession, updateUser);

export default router;
