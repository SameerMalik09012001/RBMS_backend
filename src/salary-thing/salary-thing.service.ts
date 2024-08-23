import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { SalaryNotification, SalaryNotificationDocument } from './salary.schema';
import { Request, Response } from 'express';

interface UserDTOByMiddleware {
    email: string,
    role: string,
    _id: string,
    iat: Number
}

@Injectable()
export class SalaryThingService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(SalaryNotification.name) private salaryNotification: Model<SalaryNotificationDocument>
    ) { }

    async getAllUser(res: Response, page: string, limit: string, req: Request): Promise<object> {
        const user: UserDTOByMiddleware = req["user"]
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
        } else if (user.role === 'Manager') {
            User = await this.userModel.find({
                $or: [
                    { role: 'Employee' },
                    { role: 'Team Leader' },
                ]
            }).select('-password').skip(skip).limit(realLimit).exec();
        } else if (user.role === 'Team Leader') {
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
        }

        return res.json({ User, extraInfo });
    }

    async updateSalary(res: Response, req: Request, BodyData: object): Promise<object> {
        const user: UserDTOByMiddleware = req["user"]
        const currentUser = await this.userModel.findById(user._id).select('-password')
        const promotedUser = await this.userModel.find({ id: BodyData['id'], salary: parseInt(BodyData['currentSalary']) }).select('-password')
        if (user.role === 'Admin') {
            const updateSalary = await this.userModel.findByIdAndUpdate(
                promotedUser[0]['_id'],
                {
                    $set: {
                        salary: BodyData['updatedSalary']
                    }
                },
                {
                    new: true
                }
            )
            if (!updateSalary) {
                throw new Error('updation fialed')
            }

            return res.json({ updateSalary })
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
        })

        return res.json({ updateSalary })
    }

    async approveSalary(res: Response, req: Request, BodyData: object): Promise<object> {
        const user: UserDTOByMiddleware = req["user"]
        const promotedUser = await this.userModel.find({ id: BodyData['id'], salary: BodyData['currentSalary'] }).select('-password')
        const currentUser = await this.userModel.findById(user._id).select('-password')

        if (user.role === 'Admin') {
            const updateSalary = await this.userModel.findOneAndUpdate(
                {
                    id: BodyData['id']
                },
                {
                    $set: {
                        salary: parseInt(BodyData['updatedSalary'])
                    }
                },
                {
                    new: true
                }
            )
            if (!updateSalary) {
                throw new Error('updation fialed')
            }

            const deleteNotification = await this.salaryNotification.deleteOne({
                showTo: new Types.ObjectId(user['_id']),
                currentSalary: promotedUser[0]['salary'],
                id: promotedUser[0]['id'],
                updatedSalary: parseInt(BodyData['updatedSalary'])
            })
            if (!deleteNotification) {
                throw new Error('deleted notification fialed')
            }

            return res.json({ updateSalary })
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
        })

        const deleteNotification = await this.salaryNotification.deleteOne(
            {
                showTo: new Types.ObjectId(user['_id']),
                currentSalary: promotedUser[0]['salary'],
                id: promotedUser[0]['id'],
                updatedSalary: parseInt(BodyData['updatedSalary'])
            }
        )
        if (!deleteNotification) {
            throw new Error('deletion fial after sending notifi. of salary')
        }

        return res.json({ send })
    }

    async getSalaryNotification(res: Response, req: Request): Promise<object> {
        const user = req['user']
        return res.json({ data: await this.salaryNotification.find({ showTo: new Types.ObjectId(user['_id']) }) })
    }

    async rejectSalary(res: Response, req: Request, BodyData: object): Promise<object> {
        const user = req['user']
        const deletenoti = await this.salaryNotification.deleteOne({
            showTo: new Types.ObjectId(user['_id']),
            currentSalary: BodyData['currentSalary'],
            updatedSalary: BodyData['updatedSalary'],
            id: BodyData['id']
        })

        if (!deletenoti) {
            throw new Error('deltion failed')
        }

        return res.json({
            data: deletenoti
        })
    }

    async getAllUserSalaryByRole(res: Response, req: Request, limit: string, page: string): Promise<object> {
        const user: UserDTOByMiddleware = req['user'];
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;

        let filter: any = {};

        // Role-based filtering logic
        if (user.role === 'Admin') {
            filter.role = { $ne: 'Admin' }; // Admin can see all except other Admins
        } else if (user.role === 'Manager') {
            filter.role = { $in: ['Team Leader', 'Employee'] }; // Manager can see Team Leaders and Employees
        } else if (user.role === 'Team Leader') {
            filter.role = 'Employee'; // Team Leader can see only Employees
        } else if (user.role === 'Employee') {
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

    async getUserSalaryByRoleSearchDefault(res: Response, req: Request, page: string, limit: string, search: string, role: string): Promise<object> {
        const user: UserDTOByMiddleware = req['user'];
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;

        console.log('skip is '+ skip);
        console.log('limit is '+ realLimit);

        let User = null;

        if (user.role === 'Admin') {
            console.log('admin');
            if (role === 'No' && search === 'No') {
                console.log('role no search no');
                User = await this.userModel.find({ $or: [{ role: 'Manager' }, { role: 'Team Leader' }, { role: 'Employee' }] }).select('-password').skip(skip).limit(realLimit).exec();
            } else if (role !== 'No' && search === 'No') {
                console.log('role yes search no');
                User = await this.userModel.find({ role }).select('-password').skip(skip).limit(realLimit).exec();
            } else if (role === 'No' && search !== 'No') {
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
            } else if(role !== 'No' && search !== 'No') {
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
        } else if(user.role === 'Manager') {
            console.log('Manager');
            if (role === 'No' && search === 'No') {
                console.log('role no search no');
                User = await this.userModel.find({ $or: [{ role: 'Team Leader' }, { role: 'Employee' }] }).select('-password').skip(skip).limit(realLimit).exec();
            } else if (role !== 'No' && search === 'No') {
                console.log('role yes search no');
                User = await this.userModel.find({role}).select('-password').skip(skip).limit(realLimit).exec();
            } else if (role === 'No' && search !== 'No') {
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
            } else if(role !== 'No' && search !== 'No') {
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
        } else if(user.role === 'Team Leader') {
            console.log('Team laeder');
            if (role === 'No' && search === 'No') {
                console.log('role no search no');
                User = await this.userModel.find({ role: 'Employee' }).select('-password').skip(skip).limit(realLimit).exec();
            } else if (role !== 'No' && search === 'No') {
                console.log('role yes search no');
                User = await this.userModel.find({role}).select('-password').skip(skip).limit(realLimit).exec();
            } else if (role === 'No' && search !== 'No') {
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
            } else if(role !== 'No' && search !== 'No') {
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

        //aggregate me [{},{}]
        //without me [{},{}]
        const total = User?.length

        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit)
        };

        return res.json({ manager: { User , extraInfo} });
    }

}