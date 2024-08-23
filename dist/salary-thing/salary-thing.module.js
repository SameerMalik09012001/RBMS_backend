"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryThingModule = void 0;
const common_1 = require("@nestjs/common");
const salary_thing_controller_1 = require("./salary-thing.controller");
const salary_thing_service_1 = require("./salary-thing.service");
const user_schema_1 = require("./user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const salary_schema_1 = require("./salary.schema");
let SalaryThingModule = class SalaryThingModule {
};
exports.SalaryThingModule = SalaryThingModule;
exports.SalaryThingModule = SalaryThingModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: salary_schema_1.SalaryNotification.name, schema: salary_schema_1.SalaryNotificationSchema }])],
        controllers: [salary_thing_controller_1.SalaryThingController],
        providers: [salary_thing_service_1.SalaryThingService]
    })
], SalaryThingModule);
//# sourceMappingURL=salary-thing.module.js.map