import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Response } from 'express';
export declare class UserThingsService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    private readonly saltRounds;
    hashPassword(password: string): Promise<string>;
    getAllUser(page: string, limit: string, res: Response): Promise<object>;
    getAllUserBySearch(page: string, limit: string, res: Response, keyword: string): Promise<object>;
    getAllManager(role: string, page: string, limit: string, keyword: string, req: Request): Promise<object>;
    getAllManagerAddUser(role: string, req: Request): Promise<object>;
    addUser(userData: User): Promise<{
        findUser: import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<unknown, any, any> & Required<{
            _id: unknown;
        }>;
        msg: string;
    }>;
    getByColumnFilter(FilterBody: object, page: string, limit: string, res: Response, keyword: string): Promise<object>;
}
