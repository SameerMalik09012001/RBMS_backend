import { SalaryThingService } from './salary-thing.service';
import { Request, Response } from 'express';
export declare class SalaryThingController {
    private readonly salaryThingService;
    constructor(salaryThingService: SalaryThingService);
    getAllUser(res: Response, req: Request, page: string, limit: string): object;
    updateSalary(res: Response, req: Request, BodyData: object): object;
    approveSalary(res: Response, req: Request, BodyData: object): object;
    getSalaryNotification(res: Response, req: Request): object;
    rejectSalary(res: Response, req: Request, BodyData: object): object;
    getAllUserSalaryByRole(res: Response, req: Request, page: string, limit: string): object;
    getUserSalaryByRoleSearchDefault(res: Response, req: Request, page: string, limit: string, role: string, search: string): object;
}
