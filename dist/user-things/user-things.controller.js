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
exports.UserThingsController = void 0;
const common_1 = require("@nestjs/common");
const user_things_service_1 = require("./user-things.service");
const user_schema_1 = require("./user.schema");
let UserThingsController = class UserThingsController {
    constructor(userThingsService) {
        this.userThingsService = userThingsService;
    }
    getAllUser(page, limit, res) {
        return this.userThingsService.getAllUser(page, limit, res);
    }
    getAllUserBySearch(page, limit, res, keyword) {
        return this.userThingsService.getAllUserBySearch(page, limit, res, keyword);
    }
    getAllManager(req, role, keyword, page, limit) {
        return this.userThingsService.getAllManager(role, page, limit, keyword, req);
    }
    getAllManagerAddUser(req, role) {
        return this.userThingsService.getAllManagerAddUser(role, req);
    }
    getByColumnFilter(FilterBody, keyword, page, limit, res) {
        return this.userThingsService.getByColumnFilter(FilterBody, page, limit, res, keyword);
    }
    addUser(UserData) {
        return this.userThingsService.addUser(UserData);
    }
};
exports.UserThingsController = UserThingsController;
__decorate([
    (0, common_1.Get)('/getAllUser/:page/:limit'),
    __param(0, (0, common_1.Param)('page')),
    __param(1, (0, common_1.Param)('limit')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Object)
], UserThingsController.prototype, "getAllUser", null);
__decorate([
    (0, common_1.Get)('/getAllUserBySearch/:keyword/:page/:limit'),
    __param(0, (0, common_1.Param)('page')),
    __param(1, (0, common_1.Param)('limit')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Param)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String]),
    __metadata("design:returntype", Object)
], UserThingsController.prototype, "getAllUserBySearch", null);
__decorate([
    (0, common_1.Get)('/getbyrole/:role/:keyword/:page/:limit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('role')),
    __param(2, (0, common_1.Param)('keyword')),
    __param(3, (0, common_1.Param)('page')),
    __param(4, (0, common_1.Param)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, String, String, String, String]),
    __metadata("design:returntype", Object)
], UserThingsController.prototype, "getAllManager", null);
__decorate([
    (0, common_1.Get)('/getbyroleAddUser/:role'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, String]),
    __metadata("design:returntype", Object)
], UserThingsController.prototype, "getAllManagerAddUser", null);
__decorate([
    (0, common_1.Post)('/getByColumnFilter/:keyword/:page/:limit'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('keyword')),
    __param(2, (0, common_1.Param)('page')),
    __param(3, (0, common_1.Param)('limit')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Object)
], UserThingsController.prototype, "getByColumnFilter", null);
__decorate([
    (0, common_1.Post)('/addUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Object)
], UserThingsController.prototype, "addUser", null);
exports.UserThingsController = UserThingsController = __decorate([
    (0, common_1.Controller)('user-things'),
    __metadata("design:paramtypes", [user_things_service_1.UserThingsService])
], UserThingsController);
//# sourceMappingURL=user-things.controller.js.map