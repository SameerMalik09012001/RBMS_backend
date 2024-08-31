import { BadRequestException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ApiError } from 'src/Middlewares/ApiError';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) { }

  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt?.genSalt(this.saltRounds)
    const hash = await bcrypt?.hash(password, salt);
    return hash;
  }

  async cookieCheck(req: Request, res: Response): Promise<object> {
    return res.json({ user: await this.userModel.find({ email: req['user']['email'] }).select('-password') })
  }

  async getAdmin(email: string): Promise<object> {
    const obj = await this.userModel.findOne({ email: email.toLowerCase() }).select('-password -salary')
    return { obj }
  }

  async loginUser(userData: object, res: Response): Promise<object> {
    const email = userData['email'].toLowerCase();
    const user = await this.userModel.findOne({ email: email })

    if (!user) {
      throw new ApiError(400, 'wrong credentials')
    }


    const checkPassword = await bcrypt.compare(userData['password'], user.password)

    if (!checkPassword) {
      throw new ApiError(400, 'wrong credentials')
    }

    const payload = { email: user.email, role: user.role, _id: user._id };
    const token = this.jwtService.sign(payload);

    // Set JWT as a cookie
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24,
      // httpOnly: true,
      // path: '/',
      // sameSite: 'none'
    })

    return res.json({ user, msg: 'Login successful' });
  }

  logout(res: Response): object {
    res.clearCookie('jwt', {
      // httpOnly: true,
      // secure: true,
      // path: '/',
      // sameSite: 'none'
    });
    return res.json({ msg: 'Logout successful' });
  }


}
