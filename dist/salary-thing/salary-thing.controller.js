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
exports.SalaryThingController = void 0;
const common_1 = require("@nestjs/common");
const salary_thing_service_1 = require("./salary-thing.service");
let SalaryThingController = class SalaryThingController {
    constructor(salaryThingService) {
        this.salaryThingService = salaryThingService;
    }
    getAllUser(res, req, page, limit) {
        return this.salaryThingService.getAllUser(res, page, limit, req);
    }
    updateSalary(res, req, BodyData) {
        return this.salaryThingService.updateSalary(res, req, BodyData);
    }
    approveSalary(res, req, BodyData) {
        return this.salaryThingService.approveSalary(res, req, BodyData);
    }
    getSalaryNotification(res, req) {
        return this.salaryThingService.getSalaryNotification(res, req);
    }
    rejectSalary(res, req, BodyData) {
        return this.salaryThingService.rejectSalary(res, req, BodyData);
    }
    getAllUserSalaryByRole(res, req, page, limit) {
        return this.salaryThingService.getAllUserSalaryByRole(res, req, limit, page);
    }
    getUserSalaryByRoleSearchDefault(res, req, page, limit, role, search) {
        return this.salaryThingService.getUserSalaryByRoleSearchDefault(res, req, page, limit, search, role);
    }
};
exports.SalaryThingController = SalaryThingController;
__decorate([
    (0, common_1.Get)('/getAllUser/:page/:limit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('page')),
    __param(3, (0, common_1.Param)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Object)
], SalaryThingController.prototype, "getAllUser", null);
__decorate([
    (0, common_1.Post)('/updateSalary'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Object)
], SalaryThingController.prototype, "updateSalary", null);
__decorate([
    (0, common_1.Post)('/approveSalary'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Object)
], SalaryThingController.prototype, "approveSalary", null);
__decorate([
    (0, common_1.Get)('/getSalaryNotification'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], SalaryThingController.prototype, "getSalaryNotification", null);
__decorate([
    (0, common_1.Delete)('/rejectSalary'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Object)
], SalaryThingController.prototype, "rejectSalary", null);
__decorate([
    (0, common_1.Get)('/getAllUserSalaryByRole/:page/:limit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('page')),
    __param(3, (0, common_1.Param)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Object)
], SalaryThingController.prototype, "getAllUserSalaryByRole", null);
__decorate([
    (0, common_1.Get)('/getUserSalaryByRoleSearchDefault/:role/:search/:page/:limit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('page')),
    __param(3, (0, common_1.Param)('limit')),
    __param(4, (0, common_1.Param)('role')),
    __param(5, (0, common_1.Param)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", Object)
], SalaryThingController.prototype, "getUserSalaryByRoleSearchDefault", null);
exports.SalaryThingController = SalaryThingController = __decorate([
    (0, common_1.Controller)('salary-things'),
    __metadata("design:paramtypes", [salary_thing_service_1.SalaryThingService])
], SalaryThingController);
//# sourceMappingURL=salary-thing.controller.js.map