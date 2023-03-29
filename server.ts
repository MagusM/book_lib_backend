import express from "express"
import * as mongoose from "mongoose";

const app = express();
const port = 3001 || process.env.PORT;
const dbURI = "mongodb://127.0.0.1:27017/bookloop?directConnection=true&serverSelectionTimeoutMS=10000&retryWrites=true&keepAlive=true";

console.log(`Starting server.`);

app.listen(async () => {
    try {
        console.log(`Server up and running.`)

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
