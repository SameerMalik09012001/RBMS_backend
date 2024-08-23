import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { SalaryNotificationDocument } from './salary.schema';
import { Request, Response } from 'express';
export declare class SalaryThingService {
    private userModel;
    private salaryNotification;
    constructor(userModel: Model<UserDocument>, salaryNotification: Model<SalaryNotificationDocument>);
    getAllUser(res: Response, page: string, limit: string, req: Request): Promise<object>;
    updateSalary(res: Response, req: Request, BodyData: object): Promise<object>;
    approveSalary(res: Response, req: Request, BodyData: object): Promise<object>;
    getSalaryNotification(res: Response, req: Request): Promise<object>;
    rejectSalary(res: Response, req: Request, BodyData: object): Promise<object>;
    getAllUserSalaryByRole(res: Response, req: Request, limit: string, page: string): Promise<object>;
    getUserSalaryByRoleSearchDefault(res: Response, req: Request, page: string, limit: string, search: string, role: string): Promise<object>;
}
