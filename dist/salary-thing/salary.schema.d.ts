import { Document, Types } from 'mongoose';
export type SalaryNotificationDocument = SalaryNotification & Document;
export declare class SalaryNotification {
    showTo: Types.ObjectId;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    currentSalary: Number;
    updatedSalary: Number;
}
export declare const SalaryNotificationSchema: import("mongoose").Schema<SalaryNotification, import("mongoose").Model<SalaryNotification, any, any, any, Document<unknown, any, SalaryNotification> & SalaryNotification & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SalaryNotification, Document<unknown, {}, import("mongoose").FlatRecord<SalaryNotification>> & import("mongoose").FlatRecord<SalaryNotification> & {
    _id: Types.ObjectId;
}>;
