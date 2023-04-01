// Import the necessary modules and models
import express, { Request, Response } from 'express';
import { IUser } from '../models/User';
import UserModel from '../models/User';

const login = async (req, res) => {
    try {
        const { name } = req.body;

        // Find or create user
        const { doc: user, created } = await UserModel.findOrCreate({ name });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update lastLoggedIn date for existing users
        if (!created) {
            user.lastLoggedIn = new Date();
            await user.save();
        }

        // Store user ID in session
        req.session.userId = user.id;

        // Send response
        return res.cookie('sessionId', req.session.id).status(200).send('Logged in successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error logging in');
    }
}


const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user: IUser | null = await UserModel.findOne({ id });

        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.status(200).send(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching user by id');
    }
}

const getUserByName = async (req, res) => {
    const { name } = req.params;
    try {
        const user: IUser | null = await UserModel.findOne({ name: new RegExp(name, 'i') });

        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.status(200).send(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching user by name');
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { lastLoggedIn } = req.body;

    try {
        const user: IUser | null = await UserModel.findOneAndUpdate(
            { id },
            { lastLoggedIn },
            { new: true }
        );

        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.status(200).send(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error updating user');
    }
}

// Export the user router
export {
    login,
    getUserById,
    getUserByName,
    updateUser
}
