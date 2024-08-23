"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const user_module_1 = require("./auth/user.module");
const user_things_module_1 = require("./user-things/user-things.module");
const salary_thing_module_1 = require("./salary-thing/salary-thing.module");
const middleware_1 = require("./Middlewares/middleware");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(middleware_1.Middleware)
            .forRoutes({
            path: 'user-things/getAllUser/:page/:limit',
            method: common_1.RequestMethod.GET
        }, {
            path: 'salary-things/getAllUser/:page/:limit',
            method: common_1.RequestMethod.GET
        }, {
            path: 'salary-things/updateSalary',
            method: common_1.RequestMethod.POST
        }, {
            path: 'salary-things/approveSalary',
            method: common_1.RequestMethod.POST
        }, {
            path: 'salary-things/getSalaryNotification',
            method: common_1.RequestMethod.GET
        }, {
            path: 'salary-things/rejectSalary',
            method: common_1.RequestMethod.DELETE
        }, {
            path: 'user/cookiecheck',
            method: common_1.RequestMethod.GET
        }, {
            path: 'user-things/getAllUser/:page/:limit',
            method: common_1.RequestMethod.GET
        }, {
            path: 'user-things/getAllUserBySearch/:keyword/:page/:limit',
            method: common_1.RequestMethod.GET
        }, {
            path: 'salary-things/getAllUserSalaryByRole/:page/:limit',
            method: common_1.RequestMethod.GET
        }, {
            path: 'user/logout',
            method: common_1.RequestMethod.GET
        }, {
            path: 'user/:email',
            method: common_1.RequestMethod.GET
        }, {
            path: 'user-things/getbyrole/:role/:keyword/:page/:limit',
            method: common_1.RequestMethod.GET
        }, {
            path: 'user-things/getByColumnFilter/:keyword/:page/:limit',
            method: common_1.RequestMethod.POST
        }, {
            path: 'user-things/addUser',
            method: common_1.RequestMethod.POST
        }, {
            path: 'user-things/getbyroleAddUser/:role',
            method: common_1.RequestMethod.GET
        }, {
            path: 'salary-things/getUserSalaryByRoleSearchDefault/:role/:search/:page/:limit',
            method: common_1.RequestMethod.GET
        });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env'
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI, {
                dbName: process.env.DB_NAME,
                onConnectionCreate: () => {
                    console.log('MongoDB is connected successfully!!');
                }
            }),
            user_things_module_1.UserThingsModule,
            salary_thing_module_1.SalaryThingModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map