import { UserThingsService } from './user-things.service';
import { User } from './user.schema';
import { Response } from 'express';
export declare class UserThingsController {
    private readonly userThingsService;
    constructor(userThingsService: UserThingsService);
    getAllUser(page: string, limit: string, res: Response): object;
    getAllUserBySearch(page: string, limit: string, res: Response, keyword: string): object;
    getAllManager(req: Request, role: string, keyword: string, page: string, limit: string): object;
    getAllManagerAddUser(req: Request, role: string): object;
    getByColumnFilter(FilterBody: object, keyword: string, page: string, limit: string, res: Response): object;
    addUser(UserData: User): object;
}
