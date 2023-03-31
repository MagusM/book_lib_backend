import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as mongoose from "mongoose";

import booksRoutes from './routes/booksRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import userRoutes from './routes/userRoutes';
import BookModel from './models/Book';
import WishlistModel from './models/Wishlist';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const port = 3001 || process.env.PORT;
const dbURI = process.env.DB_URI;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/books', booksRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/users', userRoutes);

console.log(`Starting server.`);

const mOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};
mongoose.connect(dbURI).then(() => {
    console.log('MongoDB connected.');
    app.listen(port, () => {
        console.log(`Server up and running.`);
    });

    // Ensure indexes and create collections
    BookModel.ensureIndexes();
    WishlistModel.ensureIndexes();

    mongoose.connection.on('open', () => {
        console.log('MongoDB connection opened.');

        // Create collections
        mongoose.connection.db.createCollection('users');
        mongoose.connection.db.createCollection('books');
        mongoose.connection.db.createCollection('wishlists');
    });
}).catch(err => {
    console.log("db failed to connect: ", err);
    process.exit(-1);
});

export default app;
