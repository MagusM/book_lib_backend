import express, { Request, Response } from 'express';
import { IUser } from '../models/User';
import UserModel from '../models/User';

const router = express.Router();

// Retrieve user by ID
router.get('/:id', async (req: Request, res: Response) => {
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

// Update user lastLoggedIn date
router.put('/:id', async (req: Request, res: Response) => {
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
