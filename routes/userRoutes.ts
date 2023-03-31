import express, { Request as ExpressRequest, Response } from 'express';
import { IUser } from '../models/User';
import UserModel from '../models/User';
import requireSession from '../middlewares/authMiddleware';

interface RequestWithSession extends ExpressRequest {
    session: any;
}

const router = express.Router();

router.post('/login', async (req: RequestWithSession, res: Response) => {
    try {
        const { name } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ name });

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        // Store user ID in session
        req.session.userId = user.id;

        // Send response
        res.status(200).send('Logged in successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});

// Retrieve user by ID
router.get('/:id', async (req: RequestWithSession, res: Response) => {
    try {
        const user: IUser | null = await UserModel.findOne({ id: req.params.id });

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user');
    }
});

/**
 * Update user lastLoggedIn date
 * 
 * todo: consider move this logic to be part of logininstead of seperate route
 */
router.put('/:id', requireSession, async (req: RequestWithSession, res: Response) => {
    try {
        const user: IUser | null = await UserModel.findOneAndUpdate(
            { id: req.params.id },
            { lastLoggedIn: new Date() },
            { new: true }
        );

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
});

export default router;
