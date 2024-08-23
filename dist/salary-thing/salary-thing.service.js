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
exports.SalaryThingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const salary_schema_1 = require("./salary.schema");
let SalaryThingService = class SalaryThingService {
    constructor(userModel, salaryNotification) {
        this.userModel = userModel;
        this.salaryNotification = salaryNotification;
    }
    async getAllUser(res, page, limit, req) {
        const user = req["user"];
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        const total = await this.userModel.countDocuments().exec();
        let User = null;
        if (user.role === 'Admin') {
            User = await this.userModel.find({
                $or: [
                    { role: 'Employee' },
                    { role: 'Manager' },
                    { role: 'Team Leader' },
                ]
            }).select('-password').skip(skip).limit(realLimit).exec();
        }
        else if (user.role === 'Manager') {
            User = await this.userModel.find({
                $or: [
                    { role: 'Employee' },
                    { role: 'Team Leader' },
                ]
            }).select('-password').skip(skip).limit(realLimit).exec();
        }
        else if (user.role === 'Team Leader') {
            User = await this.userModel.find({
                $or: [
                    { role: 'Employee' },
                ]
            }).select('-password').skip(skip).limit(realLimit).exec();
        }
        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit)
        };
        return res.json({ User, extraInfo });
    }
    async updateSalary(res, req, BodyData) {
        const user = req["user"];
        const currentUser = await this.userModel.findById(user._id).select('-password');
        const promotedUser = await this.userModel.find({ id: BodyData['id'], salary: parseInt(BodyData['currentSalary']) }).select('-password');
        if (user.role === 'Admin') {
            const updateSalary = await this.userModel.findByIdAndUpdate(promotedUser[0]['_id'], {
                $set: {
                    salary: BodyData['updatedSalary']
                }
            }, {
                new: true
            });
            if (!updateSalary) {
                throw new Error('updation fialed');
            }
            return res.json({ updateSalary });
        }
        const updateSalary = await this.salaryNotification.create({
            showTo: currentUser['reporting_manager'],
            id: promotedUser[0]['id'],
            firstName: promotedUser[0]['firstName'],
            lastName: promotedUser[0]['lastName'],
            email: promotedUser[0]['email'],
            role: promotedUser[0]['role'],
            currentSalary: promotedUser[0]['salary'],
            updatedSalary: parseInt(BodyData['updatedSalary'])
        });
        return res.json({ updateSalary });
    }
    async approveSalary(res, req, BodyData) {
        const user = req["user"];
        const promotedUser = await this.userModel.find({ id: BodyData['id'], salary: BodyData['currentSalary'] }).select('-password');
        const currentUser = await this.userModel.findById(user._id).select('-password');
        if (user.role === 'Admin') {
            const updateSalary = await this.userModel.findOneAndUpdate({
                id: BodyData['id']
            }, {
                $set: {
                    salary: parseInt(BodyData['updatedSalary'])
                }
            }, {
                new: true
            });
            if (!updateSalary) {
                throw new Error('updation fialed');
            }
            const deleteNotification = await this.salaryNotification.deleteOne({
                showTo: new mongoose_2.Types.ObjectId(user['_id']),
                currentSalary: promotedUser[0]['salary'],
                id: promotedUser[0]['id'],
                updatedSalary: parseInt(BodyData['updatedSalary'])
            });
            if (!deleteNotification) {
                throw new Error('deleted notification fialed');
            }
            return res.json({ updateSalary });
        }
        const send = await this.salaryNotification.create({
            showTo: currentUser['reporting_manager'],
            id: promotedUser[0]['id'],
            firstName: promotedUser[0]['firstName'],
            lastName: promotedUser[0]['lastName'],
            email: promotedUser[0]['email'],
            role: promotedUser[0]['role'],
            currentSalary: promotedUser[0]['salary'],
            updatedSalary: parseInt(BodyData['updatedSalary'])
        });
        const deleteNotification = await this.salaryNotification.deleteOne({
            showTo: new mongoose_2.Types.ObjectId(user['_id']),
            currentSalary: promotedUser[0]['salary'],
            id: promotedUser[0]['id'],
            updatedSalary: parseInt(BodyData['updatedSalary'])
        });
        if (!deleteNotification) {
            throw new Error('deletion fial after sending notifi. of salary');
        }
        return res.json({ send });
    }
    async getSalaryNotification(res, req) {
        const user = req['user'];
        return res.json({ data: await this.salaryNotification.find({ showTo: new mongoose_2.Types.ObjectId(user['_id']) }) });
    }
    async rejectSalary(res, req, BodyData) {
        const user = req['user'];
        const deletenoti = await this.salaryNotification.deleteOne({
            showTo: new mongoose_2.Types.ObjectId(user['_id']),
            currentSalary: BodyData['currentSalary'],
            updatedSalary: BodyData['updatedSalary'],
            id: BodyData['id']
        });
        if (!deletenoti) {
            throw new Error('deltion failed');
        }
        return res.json({
            data: deletenoti
        });
    }
    async getAllUserSalaryByRole(res, req, limit, page) {
        const user = req['user'];
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        let filter = {};
        if (user.role === 'Admin') {
            filter.role = { $ne: 'Admin' };
        }
        else if (user.role === 'Manager') {
            filter.role = { $in: ['Team Leader', 'Employee'] };
        }
        else if (user.role === 'Team Leader') {
            filter.role = 'Employee';
        }
        else if (user.role === 'Employee') {
            filter.role = 'null';
        }
        const total = await this.userModel.countDocuments(filter).exec();
        const User = await this.userModel.find(filter).select('-password').skip(skip).limit(realLimit).exec();
        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit)
        };
        return res.json({ User, extraInfo });
    }
    async getUserSalaryByRoleSearchDefault(res, req, page, limit, search, role) {
        const user = req['user'];
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        console.log('skip is ' + skip);
        console.log('limit is ' + realLimit);
        let User = null;
        if (user.role === 'Admin') {
            console.log('admin');
            if (role === 'No' && search === 'No') {
                console.log('role no search no');
                User = await this.userModel.find({ $or: [{ role: 'Manager' }, { role: 'Team Leader' }, { role: 'Employee' }] }).select('-password').skip(skip).limit(realLimit).exec();
            }
            else if (role !== 'No' && search === 'No') {
                console.log('role yes search no');
                User = await this.userModel.find({ role }).select('-password').skip(skip).limit(realLimit).exec();
            }
            else if (role === 'No' && search !== 'No') {
                console.log('role no search yes');
                User = await this.userModel.aggregate([
                    {
                        $match: {
                            $or: [
                                { role: 'Manager' },
                                { role: 'Team Leader' },
                                { role: 'Employee' }
                            ]
                        }
                    },
                    {
                        $match: {
                            $or: [
                                { id: { $regex: search, $options: 'i' } },
                                {
                                    $expr: {
                                        $regexMatch: {
                                            input: { $toString: "$salary" },
                                            regex: search,
                                            options: "i"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $limit: realLimit
                    },
                    {
                        $skip: skip
                    }
                ]);
            }
            else if (role !== 'No' && search !== 'No') {
                console.log('role yes search yes');
                User = await this.userModel.aggregate([
                    {
                        $match: {
                            role
                        }
                    },
                    {
                        $match: {
                            $or: [
                                { id: { $regex: search, $options: 'i' } },
                                {
                                    $expr: {
                                        $regexMatch: {
                                            input: { $toString: "$salary" },
                                            regex: search,
                                            options: "i"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $limit: realLimit
                    },
                    {
                        $skip: skip
                    }
                ]);
            }
        }
        else if (user.role === 'Manager') {
            console.log('Manager');
            if (role === 'No' && search === 'No') {
                console.log('role no search no');
                User = await this.userModel.find({ $or: [{ role: 'Team Leader' }, { role: 'Employee' }] }).select('-password').skip(skip).limit(realLimit).exec();
            }
            else if (role !== 'No' && search === 'No') {
                console.log('role yes search no');
                User = await this.userModel.find({ role }).select('-password').skip(skip).limit(realLimit).exec();
            }
            else if (role === 'No' && search !== 'No') {
                console.log('role no search yes');
                User = await this.userModel.aggregate([
                    {
                        $match: {
                            $or: [
                                { role: 'Team Leader' },
                                { role: 'Employee' }
                            ]
                        }
                    },
                    {
                        $match: {
                            $or: [
                                { id: { $regex: search, $options: 'i' } },
                                {
                                    $expr: {
                                        $regexMatch: {
                                            input: { $toString: "$salary" },
                                            regex: search,
                                            options: "i"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $limit: realLimit
                    },
                    {
                        $skip: skip
                    }
                ]);
            }
            else if (role !== 'No' && search !== 'No') {
                console.log('role yes search yes');
                User = await this.userModel.aggregate([
                    {
                        $match: {
                            role
                        }
                    },
                    {
                        $match: {
                            $or: [
                                { id: { $regex: search, $options: 'i' } },
                                {
                                    $expr: {
                                        $regexMatch: {
                                            input: { $toString: "$salary" },
                                            regex: search,
                                            options: "i"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $limit: realLimit
                    },
                    {
                        $skip: skip
                    }
                ]);
            }
        }
        else if (user.role === 'Team Leader') {
            console.log('Team laeder');
            if (role === 'No' && search === 'No') {
                console.log('role no search no');
                User = await this.userModel.find({ role: 'Employee' }).select('-password').skip(skip).limit(realLimit).exec();
            }
            else if (role !== 'No' && search === 'No') {
                console.log('role yes search no');
                User = await this.userModel.find({ role }).select('-password').skip(skip).limit(realLimit).exec();
            }
            else if (role === 'No' && search !== 'No') {
                console.log('role no search yes');
                User = await this.userModel.aggregate([
                    {
                        $match: {
                            role: 'Employee'
                        }
                    },
                    {
                        $match: {
                            $or: [
                                { id: { $regex: search, $options: 'i' } },
                                {
                                    $expr: {
                                        $regexMatch: {
                                            input: { $toString: "$salary" },
                                            regex: search,
                                            options: "i"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $limit: realLimit
                    },
                    {
                        $skip: skip
                    }
                ]);
            }
            else if (role !== 'No' && search !== 'No') {
                console.log('role yes search yes');
                User = await this.userModel.aggregate([
                    {
                        $match: {
                            role
                        }
                    },
                    {
                        $match: {
                            $or: [
                                { id: { $regex: search, $options: 'i' } },
                                {
                                    $expr: {
                                        $regexMatch: {
                                            input: { $toString: "$salary" },
                                            regex: search,
                                            options: "i"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $limit: realLimit
                    },
                    {
                        $skip: skip
                    }
                ]);
            }
        }
        const total = User?.length;
        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit)
        };
        return res.json({ manager: { User, extraInfo } });
    }
};
exports.SalaryThingService = SalaryThingService;
exports.SalaryThingService = SalaryThingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(salary_schema_1.SalaryNotification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SalaryThingService);
//# sourceMappingURL=salary-thing.service.js.map