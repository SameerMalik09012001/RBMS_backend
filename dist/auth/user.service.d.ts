import { UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
export declare class UserService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    private readonly saltRounds;
    hashPassword(password: string): Promise<string>;
    cookieCheck(req: Request, res: Response): Promise<object>;
    getAdmin(email: string): Promise<object>;
    loginUser(userData: object, res: Response): Promise<object>;
    logout(res: Response): object;
}
