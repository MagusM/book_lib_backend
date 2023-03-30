import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as mongoose from "mongoose";
import { ConnectOptions } from 'mongoose';


import booksRoutes from './routes/booksRoutes';
import wishlistRoutes from './routes/wishlistRoutes';

const app: Application = express();
const port = 3001 || process.env.PORT;
const dbURI = "mongodb://127.0.0.1:27017/bookloop?directConnection=true&serverSelectionTimeoutMS=10000&retryWrites=true&keepAlive=true";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/books', booksRoutes);
app.use('/api/wishlist', wishlistRoutes);

console.log(`Starting server.`);

app.listen(async () => {
    try {
        console.log(`Server up and running.`);

        const mOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        } as ConnectOptions;
        await mongoose.connect(dbURI).then(() => {
            console.log("db connected successfully on port " + port);
        }).catch(err => {
            console.log("db failed to connect: ", err);
            throw err;
        })
    } catch (err) {
        console.log(`Server shut down: ${err}`)
        process.exit(-1);
    }
});

export default app;