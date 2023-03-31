// Import the necessary modules and models
import express, { Request, Response } from 'express';
import { IUser } from '../models/User';
import UserModel from '../models/User';

// Create a new router for the user routes
const router = express.Router();

// Define the GET route for retrieving a user by ID
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user: IUser | null = await UserModel.findOne({ id });

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

// Define the PUT route for updating a user's lastLoggedIn property
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lastLoggedIn } = req.body;

    try {
        const user: IUser | null = await UserModel.findOneAndUpdate(
            { id },
            { lastLoggedIn },
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

// Export the user router
export default router;
