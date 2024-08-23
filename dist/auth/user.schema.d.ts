import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    salary: Number;
    email: string;
    contactNo: string;
    role: string;
    gender: string;
    dob: Date;
    reporting_manager?: Types.ObjectId;
    password: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
