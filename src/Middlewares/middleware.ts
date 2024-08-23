import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Response, Request, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';  // Import the jwt module


@Injectable()
export class Middleware implements NestMiddleware {
  use(req: Request, _:Response , next: NextFunction) {
    console.log('Middleware chala hai...');
    const cookieHeader = req?.rawHeaders[req?.rawHeaders?.indexOf("Cookie") + 1]

    if (!cookieHeader) {
      throw new UnauthorizedException('No cookies found');
    }

    // Find and extract the JWT token from the cookies
    const jwtToken = cookieHeader.split('; ').find(cookie => cookie.startsWith('jwt='));
    if (!jwtToken) {
      throw new UnauthorizedException('No JWT token found in cookies');
    }

    // Remove 'jwt=' prefix to get the token itself
    const token = jwtToken.split('=')[1];


    // Verify the JWT token
    const secretKey = 'your-secret-key';
    const decoded = jwt.verify(token, secretKey);


    req['user'] = decoded;

    next();
  }
}

