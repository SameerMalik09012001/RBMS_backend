import { Body, Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { SalaryThingService } from './salary-thing.service';
import { Request, Response } from 'express';

@Controller('salary-things')
export class SalaryThingController {
    constructor(private readonly salaryThingService: SalaryThingService) {}

    @Get('/getAllUser/:page/:limit')
    getAllUser(@Res() res: Response,@Req() req: Request, @Param('page') page: string, @Param('limit') limit: string): object {
        return this.salaryThingService.getAllUser(res, page, limit, req)
    }

    @Post('/updateSalary')
    updateSalary(@Res() res: Response, @Req() req: Request, @Body() BodyData:object): object {
        return this.salaryThingService.updateSalary(res, req, BodyData)
    }

    @Post('/approveSalary')
    approveSalary(@Res() res: Response, @Req() req: Request, @Body() BodyData:object): object {
        return this.salaryThingService.approveSalary(res, req, BodyData)
    }

    @Get('/getSalaryNotification')
    getSalaryNotification(@Res() res: Response, @Req() req: Request): object {
        return this.salaryThingService.getSalaryNotification(res, req)
    }

    @Delete('/rejectSalary')
    rejectSalary(@Res() res: Response, @Req() req: Request, @Body() BodyData:object): object {
        return this.salaryThingService.rejectSalary(res, req, BodyData);
    }

    @Get('/getAllUserSalaryByRole/:page/:limit')
    getAllUserSalaryByRole(@Res() res: Response, @Req() req: Request,@Param('page') page: string, @Param('limit') limit: string ):object {
        return this.salaryThingService.getAllUserSalaryByRole(res, req, limit, page)
    }

    @Get('/getUserSalaryByRoleSearchDefault/:role/:search/:page/:limit')
    getUserSalaryByRoleSearchDefault(@Res() res: Response, @Req() req: Request,@Param('page') page: string, @Param('limit') limit: string, @Param('role') role: string, @Param('search') search: string):object {
        return this.salaryThingService.getUserSalaryByRoleSearchDefault(res, req, page, limit, search, role)
    }

}
