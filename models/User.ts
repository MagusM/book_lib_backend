import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    id: string;
    name: string;
    lastLoggedIn: Date;
}

const UserSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lastLoggedIn: {
        type: Date,
        default: Date.now
    }
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
