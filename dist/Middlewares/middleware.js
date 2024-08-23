"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let Middleware = class Middleware {
    use(req, _, next) {
        console.log('Middleware chala hai...');
        const cookieHeader = req?.rawHeaders[req?.rawHeaders?.indexOf("Cookie") + 1];
        if (!cookieHeader) {
            throw new common_1.UnauthorizedException('No cookies found');
        }
        const jwtToken = cookieHeader.split('; ').find(cookie => cookie.startsWith('jwt='));
        if (!jwtToken) {
            throw new common_1.UnauthorizedException('No JWT token found in cookies');
        }
        const token = jwtToken.split('=')[1];
        const secretKey = 'your-secret-key';
        const decoded = jwt.verify(token, secretKey);
        req['user'] = decoded;
        next();
    }
};
exports.Middleware = Middleware;
exports.Middleware = Middleware = __decorate([
    (0, common_1.Injectable)()
], Middleware);
//# sourceMappingURL=middleware.js.map