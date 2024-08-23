import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import {UserThingsService} from './user-things.service';
import { User } from './user.schema';
import { Response } from 'express';

@Controller('user-things')
export class UserThingsController {
    constructor(private readonly userThingsService: UserThingsService) {}

    @Get('/getAllUser/:page/:limit')
    getAllUser(@Param('page') page: string, @Param('limit') limit: string, @Res() res: Response) : object {
        return this.userThingsService.getAllUser(page, limit, res)
    }

    @Get('/getAllUserBySearch/:keyword/:page/:limit')
    getAllUserBySearch(@Param('page') page: string, @Param('limit') limit: string, @Res() res: Response, @Param('keyword') keyword:string) : object {
        return this.userThingsService.getAllUserBySearch(page, limit, res, keyword)
    }

    @Get('/getbyrole/:role/:keyword/:page/:limit')
    getAllManager(@Req() req: Request ,@Param('role') role: string, @Param('keyword') keyword: string, @Param('page') page: string, @Param('limit') limit: string): object {
        return this.userThingsService.getAllManager(role, page, limit, keyword, req)
    }

    @Get('/getbyroleAddUser/:role')
    getAllManagerAddUser(@Req() req: Request ,@Param('role') role: string): object {
        return this.userThingsService.getAllManagerAddUser(role, req)
    }

    @Post('/getByColumnFilter/:keyword/:page/:limit')
    getByColumnFilter(@Body() FilterBody: object,@Param('keyword') keyword:string, @Param('page') page: string, @Param('limit') limit: string, @Res() res:Response): object {
        return this.userThingsService.getByColumnFilter(FilterBody, page, limit, res, keyword)
    }

    @Post('/addUser')
    addUser(@Body() UserData: User): object {
        return this.userThingsService.addUser(UserData)
    }
}
