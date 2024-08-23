import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
declare enum Role {
    Admin = "Admin",
    Employee = "Employee",
    Manager = "Manager",
    TeamLeader = "Team Leader"
}
declare enum Gender {
    Male = "Male",
    Female = "Female"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    role: Role;
    gender: Gender;
    dob: Date;
    salary: string;
    reporting_manager?: Types.ObjectId | '';
    password: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
export {};
