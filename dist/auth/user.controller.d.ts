import { UserService } from './user.service';
import { Request, Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    cookieCheck(req: Request, res: Response): object;
    loginUser(userData: object, res: Response): object;
    logout(res: Response): object;
    getAdmin(email: string): object;
}
