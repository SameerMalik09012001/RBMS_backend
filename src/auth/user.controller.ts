import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/cookieCheck')
  cookieCheck(@Req() req: Request, @Res() res: Response): object {
    return this.userService.cookieCheck(req, res)
  }

  @Post('/login')
  loginUser(@Body() userData: object, @Res() res: Response): object {
    return this.userService.loginUser(userData, res);
  }

  @Get('/logout')
  logout(@Res() res: Response): object {
    return this.userService.logout(res)
  }

  @Get('/:email')
  getAdmin(@Param('email') email: string): object {
    return this.userService.getAdmin(email);
  }

}
