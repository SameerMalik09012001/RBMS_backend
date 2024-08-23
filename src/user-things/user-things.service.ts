import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { Response } from 'express';
import { ApiError } from 'src/Middlewares/ApiError';

@Injectable()
export class UserThingsService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    private readonly saltRounds = 10;

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt?.genSalt(this.saltRounds)
        const hash = await bcrypt?.hash(password, salt);
        return hash;
    }

    async getAllUser(page: string, limit: string, res: Response): Promise<object> {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        const total = await this.userModel.countDocuments().exec();
        const User = await this.userModel.find().select('-password').skip(skip).limit(realLimit).exec();
        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit)
        }

        return res.json({ User, extraInfo });
    }

    async getAllUserBySearch(page: string, limit: string, res: Response, keyword: string): Promise<object> {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;

        // Define the filter condition based on the keyword
        const filter = keyword
            ? {
                $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },//(case-insensitive)
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

    async getAllManager(role: string, page: string, limit: string, keyword: string, req: Request): Promise<object> {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;
        let filter = {};
        let filter1 = {};

        


        if (keyword === 'No') {
            filter = { $or: [{role}] }
        } else if (keyword !== 'No' && role === 'No') {
            filter = {
                $or: [
                    {role: {$ne: 'Admin'}},
                    { firstName: { $regex: keyword, $options: 'i' } },//(case-insensitive)
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
            }
        } else {
            filter = {
                role,
                $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },//(case-insensitive)
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
            }
        }


        const total = await this.userModel.countDocuments(filter).exec();
        const User = await this.userModel
            .find(filter)
            .select('-password')
            .skip(skip)
            .limit(realLimit)

        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit),
        };


        return { manager: { User, extraInfo } }
    }

    async getAllManagerAddUser(role: string, req: Request): Promise<object> {       

        const User = await this.userModel
            .find({role})
            .select('-password')


        return { manager: User }
    }

    async addUser(userData: User) {
        userData.password = await this.hashPassword(userData.password);
        userData.email = userData.email.toLowerCase();
        if (userData.reporting_manager !== '') {
            userData.reporting_manager = new Types.ObjectId(userData.reporting_manager)
        } else {
            userData.reporting_manager = ''
        }
        const user = await this.userModel.create(userData)
        if (!user) {
            throw new ApiError(300, 'User Creation failed')
        }

        const findUser = await this.userModel.findById(user._id)

        return { findUser, msg: 'user created successfully!!' }
    }

    async getByColumnFilter(FilterBody: object, page: string, limit: string, res: Response, keyword: string): Promise<object> {
        const realPage = parseInt(page);
        const realLimit = parseInt(limit);
        const skip = (realPage - 1) * realLimit;

        // Construct the filter object based on the searchParams
        const filter: Record<string, any> = {};

        Object.keys(FilterBody).forEach(key => {
            if (FilterBody[key]) {
                if (key !== 'gender') {
                    filter[key] = { $regex: FilterBody[key], $options: 'i' }; // case-insensitive search
                } else {
                    filter[key] = FilterBody[key];
                }
            }
        });

        let User = null;
        let total = null;
        if (keyword !== 'null') {
            total = await this.userModel.countDocuments({
                ...filter, $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },//(case-insensitive)
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
                        { firstName: { $regex: keyword, $options: 'i' } },//(case-insensitive)
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
                .limit(realLimit)
        } else {
            total = await this.userModel.countDocuments(filter).exec();
            User = await this.userModel
                .find(filter)
                .select('-password -salary')
                .skip(skip)
                .limit(realLimit)
        }


        const extraInfo = {
            totalDocs: total,
            pageNo: realPage,
            totalPage: Math.ceil(total / realLimit),
        };

        return res.json({ User, extraInfo });
    }
}