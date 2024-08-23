import { NestMiddleware } from "@nestjs/common";
import { Response, Request, NextFunction } from "express";
export declare class Middleware implements NestMiddleware {
    use(req: Request, _: Response, next: NextFunction): void;
}
