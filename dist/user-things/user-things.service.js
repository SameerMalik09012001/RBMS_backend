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
exports.UserThingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const bcrypt = require("bcrypt");
const mongoose_3 = require("mongoose");
const ApiError_1 = require("../Middlewares/ApiError");
let UserThingsService = class UserThingsService {
    constructor(userModel) {
        this.userModel = userModel;
        this.saltRounds = 10;
    }
    async hashPassword(password) {
        const salt = await bcrypt?.genSalt(this.saltRounds);
        const hash = await bcrypt?.hash(password, salt);
        return hash;
    }
    async getAllUser(page, limit, res) {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        const total = await this.userModel.countDocuments().exec();
        const User = await this.userModel.find().select('-password').skip(skip).limit(realLimit).exec();
        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit)
        };
        return res.json({ User, extraInfo });
    }
    async getAllUserBySearch(page, limit, res, keyword) {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        const filter = keyword
            ? {
                $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { id: { $regex: keyword, $options: 'i' } },
                    { lastName: { $regex: keyword, $options: 'i' } },
                    { contactNo: { $regex: keyword, $options: 'i' } },
                    { gender: keyword },
                    { role: { $regex: keyword, $options: 'i' } },
                ],
            }
            : {};
        const total = await this.userModel.countDocuments(filter).exec();
        const User = await this.userModel
            .find(filter)
            .select('-password -salary')
            .skip(skip)
            .limit(realLimit)
            .exec();
        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit),
        };
        return res.json({ User, extraInfo });
    }
    async getAllManager(role, page, limit, keyword, req) {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        let filter = {};
        let filter1 = {};
        if (keyword === 'No') {
            filter = { $or: [{ role }] };
        }
        else if (keyword !== 'No' && role === 'No') {
            filter = {
                $or: [
                    { role: { $ne: 'Admin' } },
                    { firstName: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { id: { $regex: keyword, $options: 'i' } },
                    { lastName: { $regex: keyword, $options: 'i' } },
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $toString: "$salary" },
                                regex: keyword,
                                options: "i"
                            }
                        }
                    }
                ],
            };
        }
        else {
            filter = {
                role,
                $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { id: { $regex: keyword, $options: 'i' } },
                    { lastName: { $regex: keyword, $options: 'i' } },
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $toString: "$salary" },
                                regex: keyword,
                                options: "i"
                            }
                        }
                    }
                ],
            };
        }
        const total = await this.userModel.countDocuments(filter).exec();
        const User = await this.userModel
            .find(filter)
            .select('-password')
            .skip(skip)
            .limit(realLimit);
        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit),
        };
        return { manager: { User, extraInfo } };
    }
    async getAllManagerAddUser(role, req) {
        const User = await this.userModel
            .find({ role })
            .select('-password');
        return { manager: User };
    }
    async addUser(userData) {
        userData.password = await this.hashPassword(userData.password);
        userData.email = userData.email.toLowerCase();
        if (userData.reporting_manager !== '') {
            userData.reporting_manager = new mongoose_3.Types.ObjectId(userData.reporting_manager);
        }
        else {
            userData.reporting_manager = '';
        }
        const user = await this.userModel.create(userData);
        if (!user) {
            throw new ApiError_1.ApiError(300, 'User Creation failed');
        }
        const findUser = await this.userModel.findById(user._id);
        return { findUser, msg: 'user created successfully!!' };
    }
    async getByColumnFilter(FilterBody, page, limit, res, keyword) {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        const filter = {};
        Object.keys(FilterBody).forEach(key => {
            if (FilterBody[key]) {
                if (key !== 'gender') {
                    filter[key] = { $regex: FilterBody[key], $options: 'i' };
                }
                else {
                    filter[key] = FilterBody[key];
                }
            }
        });
        let User = null;
        let total = null;
        if (keyword !== 'null') {
            total = await this.userModel.countDocuments({
                ...filter, $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { id: { $regex: keyword, $options: 'i' } },
                    { lastName: { $regex: keyword, $options: 'i' } },
                    { contactNo: { $regex: keyword, $options: 'i' } },
                    { gender: keyword },
                    { role: { $regex: keyword, $options: 'i' } },
                ]
            }).exec();
            User = await this.userModel
                .find({
                ...filter, $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { id: { $regex: keyword, $options: 'i' } },
                    { lastName: { $regex: keyword, $options: 'i' } },
                    { contactNo: { $regex: keyword, $options: 'i' } },
                    { gender: keyword },
                    { role: { $regex: keyword, $options: 'i' } },
                ]
            })
                .select('-password -salary')
                .skip(skip)
                .limit(realLimit);
        }
        else {
            total = await this.userModel.countDocuments(filter).exec();
            User = await this.userModel
                .find(filter)
                .select('-password -salary')
                .skip(skip)
                .limit(realLimit);
        }
        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit),
        };
        return res.json({ User, extraInfo });
    }
};
exports.UserThingsService = UserThingsService;
exports.UserThingsService = UserThingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserThingsService);
//# sourceMappingURL=user-things.service.js.map