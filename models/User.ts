import { Schema, model, Document, Model } from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
    id?: string;
    name: string;
    lastLoggedIn?: Date;
}

export interface IUserModel extends Model<IUser> {
    findOrCreate: (conditions: any, doc?: any) => Promise<{ doc: IUser; created: boolean }>;
}

const UserSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4()
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

UserSchema.plugin(findOrCreate);

const UserModel: IUserModel = model<IUser, IUserModel>('User', UserSchema);

export default UserModel;
