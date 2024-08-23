"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("./user.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const ApiError_1 = require("../Middlewares/ApiError");
let UserService = class UserService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.saltRounds = 10;
    }
    async hashPassword(password) {
        const salt = await bcrypt?.genSalt(this.saltRounds);
        const hash = await bcrypt?.hash(password, salt);
        return hash;
    }
    async cookieCheck(req, res) {
        return res.json({ user: await this.userModel.find({ email: req['user']['email'] }).select('-password') });
    }
    async getAdmin(email) {
        const obj = await this.userModel.findOne({ email: email.toLowerCase() }).select('-password -salary');
        return { obj };
    }
    async loginUser(userData, res) {
        const email = userData['email'].toLowerCase();
        const user = await this.userModel.findOne({ email: email });
        if (!user) {
            throw new ApiError_1.ApiError(400, 'wrong credentials');
        }
        const checkPassword = await bcrypt.compare(userData['password'], user.password);
        if (!checkPassword) {
            throw new ApiError_1.ApiError(400, 'wrong credentials');
        }
        const payload = { email: user.email, role: user.role, _id: user._id };
        const token = this.jwtService.sign(payload);
        res.cookie('jwt', token, {
            maxAge: 3600000 * 24
        });
        return res.json({ user, msg: 'Login successful' });
    }
    logout(res) {
        res.clearCookie('jwt');
        return res.json({ msg: 'Logout successful' });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map